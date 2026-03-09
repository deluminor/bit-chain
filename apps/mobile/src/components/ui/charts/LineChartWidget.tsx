import * as d3Shape from 'd3-shape';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent, PanResponder, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop } from 'react-native-svg';
import { colors } from '~/src/design/tokens';

export interface LineChartPoint {
  value: number;
  label: string;
  isoDate?: string;
}

export interface ActiveLineChartPoint extends LineChartPoint {
  index: number;
  x: number;
  y: number;
}

interface ChartPoint extends ActiveLineChartPoint {}

interface LineChartWidgetProps {
  points: ReadonlyArray<LineChartPoint>;
  height?: number;
  lineColor?: string;
  onActivePointChange?: (point: ActiveLineChartPoint | null) => void;
  onInteractionChange?: (isInteracting: boolean) => void;
  interactive?: boolean;
}

const PADDING_X = 10;
const PADDING_Y = 10;

export function LineChartWidget({
  points,
  height = 140,
  lineColor = colors.brand,
  onActivePointChange,
  onInteractionChange,
  interactive = true,
}: LineChartWidgetProps) {
  const [width, setWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const gradientIdRef = useRef(`areaGrad-${Math.random().toString(36).slice(2, 10)}`);

  const normalizedPoints = useMemo(
    () =>
      points.reduce<LineChartPoint[]>((acc, point) => {
        const value = Number(point.value);

        if (Number.isFinite(value)) {
          acc.push({ ...point, value });
          return acc;
        }

        const prev = acc[acc.length - 1];
        if (prev) {
          acc.push({ ...point, value: prev.value });
        }

        return acc;
      }, []),
    [points],
  );

  useEffect(() => {
    if (normalizedPoints.length === 0) {
      setActiveIndex(null);
      return;
    }

    setActiveIndex(prev => {
      if (typeof prev === 'number' && prev >= 0 && prev < normalizedPoints.length) {
        return prev;
      }
      return normalizedPoints.length - 1;
    });
  }, [normalizedPoints]);

  const { chartPoints, path, areaPath, innerWidth } = useMemo(() => {
    if (width === 0 || normalizedPoints.length === 0) {
      return { chartPoints: [] as ChartPoint[], path: '', areaPath: '', innerWidth: 0 };
    }

    const values = normalizedPoints.map(point => point.value);
    const rawMin = Math.min(...values);
    const rawMax = Math.max(...values);
    const lowerBound = Math.min(0, rawMin);
    const upperBound = Math.max(0, rawMax);
    const spread = Math.max(upperBound - lowerBound, 1);
    const min = lowerBound - (lowerBound < 0 ? spread * 0.04 : 0);
    const max = upperBound + spread * 0.08;
    const valueRange = Math.max(max - min, 1);
    const safeInnerWidth = Math.max(0, width - PADDING_X * 2);
    const timestamps = normalizedPoints.map((point, index) => {
      if (!point.isoDate) return index;
      const parsed = Date.parse(point.isoDate);
      return Number.isFinite(parsed) ? parsed : index;
    });
    const minTimestamp = Math.min(...timestamps);
    const maxTimestamp = Math.max(...timestamps);
    const hasTimestampSpread = maxTimestamp > minTimestamp;

    const pointsWithCoords: ChartPoint[] = normalizedPoints.map((point, index) => {
      const xRatio = hasTimestampSpread
        ? ((timestamps[index] ?? minTimestamp) - minTimestamp) /
          Math.max(maxTimestamp - minTimestamp, 1)
        : index / Math.max(normalizedPoints.length - 1, 1);
      const x =
        PADDING_X +
        xRatio * safeInnerWidth;
      const y =
        height -
        PADDING_Y -
        ((point.value - min) / valueRange) * Math.max(height - PADDING_Y * 2, 1);

      return {
        ...point,
        index,
        x,
        y,
      };
    });

    const lineGenerator = d3Shape
      .line<ChartPoint>()
      .x(d => d.x)
      .y(d => d.y)
      .curve(d3Shape.curveMonotoneX);

    const areaGenerator = d3Shape
      .area<ChartPoint>()
      .x(d => d.x)
      .y0(height - 2)
      .y1(d => d.y)
      .curve(d3Shape.curveMonotoneX);

    return {
      chartPoints: pointsWithCoords,
      path: lineGenerator(pointsWithCoords) || '',
      areaPath: areaGenerator(pointsWithCoords) || '',
      innerWidth: safeInnerWidth,
    };
  }, [height, normalizedPoints, width]);

  const resolvedActiveIndex =
    activeIndex !== null && activeIndex >= 0 && activeIndex < chartPoints.length
      ? activeIndex
      : chartPoints.length > 0
        ? chartPoints.length - 1
        : null;
  const activePoint: ActiveLineChartPoint | null =
    resolvedActiveIndex !== null ? chartPoints[resolvedActiveIndex] ?? null : null;

  useEffect(() => {
    if (!onActivePointChange) return;
    onActivePointChange(activePoint);
  }, [activePoint, onActivePointChange]);

  useEffect(() => {
    return () => {
      onInteractionChange?.(false);
    };
  }, [onInteractionChange]);

  useEffect(() => {
    if (!interactive || chartPoints.length === 0) {
      onInteractionChange?.(false);
    }
  }, [chartPoints.length, interactive, onInteractionChange]);

  const panResponder = useMemo(() => {
    const resolveIndex = (locationX: number): number => {
      if (chartPoints.length <= 1) return 0;
      const clampedX = Math.max(PADDING_X, Math.min(PADDING_X + innerWidth, locationX));
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      for (const point of chartPoints) {
        const distance = Math.abs(point.x - clampedX);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = point.index;
        }
      }

      return closestIndex;
    };

    const setFromLocation = (locationX: number) => {
      if (chartPoints.length === 0) return;
      setActiveIndex(resolveIndex(locationX));
    };

    return PanResponder.create({
      onStartShouldSetPanResponder: () => interactive && chartPoints.length > 0,
      onMoveShouldSetPanResponder: () => interactive && chartPoints.length > 0,
      onPanResponderTerminationRequest: () => false,
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: event => {
        onInteractionChange?.(true);
        setFromLocation(event.nativeEvent.locationX);
      },
      onPanResponderMove: event => setFromLocation(event.nativeEvent.locationX),
      onPanResponderRelease: () => onInteractionChange?.(false),
      onPanResponderTerminate: () => onInteractionChange?.(false),
    });
  }, [chartPoints, innerWidth, interactive, onInteractionChange]);

  const onLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  return (
    <View
      style={[styles.container, { height }]}
      onLayout={onLayout}
      {...(interactive ? panResponder.panHandlers : undefined)}
    >
      {width > 0 && chartPoints.length > 0 && (
        <Svg width={width} height={height}>
          <Defs>
            <LinearGradient id={gradientIdRef.current} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={lineColor} stopOpacity="0.35" />
              <Stop offset="100%" stopColor={lineColor} stopOpacity="0" />
            </LinearGradient>
          </Defs>

          <Path d={areaPath} fill={`url(#${gradientIdRef.current})`} />
          <Path d={path} fill="none" stroke={lineColor} strokeWidth={2.5} />

          {activePoint && (
            <>
              <Line
                x1={activePoint.x}
                x2={activePoint.x}
                y1={PADDING_Y}
                y2={height - PADDING_Y / 2}
                stroke={colors.textDisabled}
                strokeOpacity={0.35}
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              <Circle
                cx={activePoint.x}
                cy={activePoint.y}
                r={5}
                fill={colors.white}
                stroke={lineColor}
                strokeWidth={2.5}
              />
            </>
          )}
        </Svg>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});
