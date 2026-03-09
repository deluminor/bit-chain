import * as d3Shape from 'd3-shape';
import React, { useEffect, useMemo, useState } from 'react';
import { LayoutChangeEvent, PanResponder, StyleSheet, View } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import { colors } from '~/src/design/tokens';

export interface ComparisonLineChartPoint {
  day: number;
  label: string;
  currentValue: number | null;
  previousValue: number | null;
}

export interface ActiveComparisonLineValue {
  day: number;
  label: string;
  value: number;
  index: number;
  x: number;
  y: number;
}

export interface ActiveComparisonLineChartPoint {
  anchorDay: number;
  anchorLabel: string;
  current: ActiveComparisonLineValue | null;
  previous: ActiveComparisonLineValue | null;
}

interface LineChartComparisonProps {
  points: ReadonlyArray<ComparisonLineChartPoint>;
  height?: number;
  currentLineColor?: string;
  previousLineColor?: string;
  onActivePointChange?: (point: ActiveComparisonLineChartPoint | null) => void;
  onInteractionChange?: (isInteracting: boolean) => void;
  interactive?: boolean;
}

interface ChartPoint extends ComparisonLineChartPoint {
  index: number;
  x: number;
  yCurrent: number | null;
  yPrevious: number | null;
}

const PADDING_X = 10;
const PADDING_Y = 10;

export function ComparisonLineChartWidget({
  points,
  height = 150,
  currentLineColor = colors.expense,
  previousLineColor = colors.textDisabled,
  onActivePointChange,
  onInteractionChange,
  interactive = true,
}: LineChartComparisonProps) {
  const [width, setWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const normalizedPoints = useMemo(
    () =>
      points.map(point => {
        const normalizedCurrent =
          typeof point.currentValue === 'number' && Number.isFinite(point.currentValue)
            ? point.currentValue
            : null;
        const normalizedPrevious =
          typeof point.previousValue === 'number' && Number.isFinite(point.previousValue)
            ? point.previousValue
            : null;

        return {
          ...point,
          currentValue: normalizedCurrent,
          previousValue: normalizedPrevious,
        };
      }),
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

      const lastCurrentIndex = [...normalizedPoints]
        .reverse()
        .findIndex(point => typeof point.currentValue === 'number');
      if (lastCurrentIndex >= 0) {
        return normalizedPoints.length - 1 - lastCurrentIndex;
      }

      return normalizedPoints.length - 1;
    });
  }, [normalizedPoints]);

  const { currentPath, previousPath, chartPoints, innerWidth } = useMemo(() => {
    if (width === 0 || normalizedPoints.length === 0) {
      return {
        currentPath: '',
        previousPath: '',
        chartPoints: [] as ChartPoint[],
        innerWidth: 0,
      };
    }

    const sourcePoints =
      normalizedPoints.length === 1
        ? [...normalizedPoints, { ...normalizedPoints[0]!, label: normalizedPoints[0]!.label }]
        : normalizedPoints;

    const values = sourcePoints
      .flatMap(point => [point.currentValue, point.previousValue])
      .filter((value): value is number => typeof value === 'number' && Number.isFinite(value));
    const safeValues = values.length > 0 ? values : [0];
    const rawMin = Math.min(...safeValues);
    const rawMax = Math.max(...safeValues);
    const lowerBound = Math.min(0, rawMin);
    const upperBound = Math.max(0, rawMax);
    const spread = Math.max(upperBound - lowerBound, 1);
    const min = lowerBound - (lowerBound < 0 ? spread * 0.04 : 0);
    const max = upperBound + spread * 0.08;
    const valueRange = Math.max(max - min, 1);
    const innerWidth = Math.max(0, width - PADDING_X * 2);
    const drawableHeight = Math.max(height - PADDING_Y * 2, 1);

    const resolvedPoints: ChartPoint[] = sourcePoints.map((point, index) => {
      const ratio = index / Math.max(sourcePoints.length - 1, 1);
      const x = PADDING_X + ratio * innerWidth;
      const yCurrent =
        typeof point.currentValue === 'number'
          ? height - PADDING_Y - ((point.currentValue - min) / valueRange) * drawableHeight
          : null;
      const yPrevious =
        typeof point.previousValue === 'number'
          ? height - PADDING_Y - ((point.previousValue - min) / valueRange) * drawableHeight
          : null;

      return {
        ...point,
        index,
        x,
        yCurrent,
        yPrevious,
      };
    });

    const currentLineGenerator = d3Shape
      .line<ChartPoint>()
      .defined(point => point.yCurrent !== null)
      .x(point => point.x)
      .y(point => point.yCurrent ?? 0)
      .curve(d3Shape.curveMonotoneX);

    const previousLineGenerator = d3Shape
      .line<ChartPoint>()
      .defined(point => point.yPrevious !== null)
      .x(point => point.x)
      .y(point => point.yPrevious ?? 0)
      .curve(d3Shape.curveMonotoneX);

    return {
      currentPath: currentLineGenerator(resolvedPoints) || '',
      previousPath: previousLineGenerator(resolvedPoints) || '',
      chartPoints: resolvedPoints,
      innerWidth,
    };
  }, [height, normalizedPoints, width]);

  const resolvedActiveIndex =
    activeIndex !== null && activeIndex >= 0 && activeIndex < chartPoints.length
      ? activeIndex
      : chartPoints.length > 0
        ? chartPoints.length - 1
        : null;
  const activeAnchorPoint =
    resolvedActiveIndex !== null ? chartPoints[resolvedActiveIndex] ?? null : null;

  const resolveNearestDefinedPoint = (
    startIndex: number,
    selector: (point: ChartPoint) => number | null,
  ): ChartPoint | null => {
    for (let radius = 0; radius < chartPoints.length; radius += 1) {
      const leftIndex = startIndex - radius;
      if (leftIndex >= 0) {
        const leftPoint = chartPoints[leftIndex];
        if (leftPoint && selector(leftPoint) !== null) {
          return leftPoint;
        }
      }

      if (radius === 0) continue;
      const rightIndex = startIndex + radius;
      if (rightIndex < chartPoints.length) {
        const rightPoint = chartPoints[rightIndex];
        if (rightPoint && selector(rightPoint) !== null) {
          return rightPoint;
        }
      }
    }

    return null;
  };

  const activeCurrentPoint =
    resolvedActiveIndex !== null
      ? resolveNearestDefinedPoint(resolvedActiveIndex, point => point.yCurrent)
      : null;
  const activePreviousPoint =
    resolvedActiveIndex !== null
      ? resolveNearestDefinedPoint(resolvedActiveIndex, point => point.yPrevious)
      : null;

  useEffect(() => {
    if (!onActivePointChange) return;

    if (!activeAnchorPoint) {
      onActivePointChange(null);
      return;
    }

    const currentValue =
      activeCurrentPoint &&
      typeof activeCurrentPoint.currentValue === 'number' &&
      typeof activeCurrentPoint.yCurrent === 'number'
        ? {
            day: activeCurrentPoint.day,
            label: activeCurrentPoint.label,
            value: activeCurrentPoint.currentValue,
            index: activeCurrentPoint.index,
            x: activeCurrentPoint.x,
            y: activeCurrentPoint.yCurrent,
          }
        : null;

    const previousValue =
      activePreviousPoint &&
      typeof activePreviousPoint.previousValue === 'number' &&
      typeof activePreviousPoint.yPrevious === 'number'
        ? {
            day: activePreviousPoint.day,
            label: activePreviousPoint.label,
            value: activePreviousPoint.previousValue,
            index: activePreviousPoint.index,
            x: activePreviousPoint.x,
            y: activePreviousPoint.yPrevious,
          }
        : null;

    onActivePointChange({
      anchorDay: activeAnchorPoint.day,
      anchorLabel: activeAnchorPoint.label,
      current: currentValue,
      previous: previousValue,
    });
  }, [activeAnchorPoint, activeCurrentPoint, activePreviousPoint, onActivePointChange]);

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
          <Path
            d={previousPath}
            fill="none"
            stroke={previousLineColor}
            strokeWidth={2}
            strokeDasharray="6 4"
            strokeLinecap="round"
          />
          <Path
            d={currentPath}
            fill="none"
            stroke={currentLineColor}
            strokeWidth={2.5}
            strokeLinecap="round"
          />

          {activeAnchorPoint && (
            <>
              <Line
                x1={activeAnchorPoint.x}
                x2={activeAnchorPoint.x}
                y1={PADDING_Y}
                y2={height - PADDING_Y / 2}
                stroke={colors.textDisabled}
                strokeOpacity={0.35}
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              {activePreviousPoint && typeof activePreviousPoint.yPrevious === 'number' && (
                <Circle
                  cx={activePreviousPoint.x}
                  cy={activePreviousPoint.yPrevious}
                  r={4}
                  fill={colors.white}
                  stroke={previousLineColor}
                  strokeWidth={1.5}
                />
              )}
              {activeCurrentPoint && typeof activeCurrentPoint.yCurrent === 'number' && (
                <Circle
                  cx={activeCurrentPoint.x}
                  cy={activeCurrentPoint.yCurrent}
                  r={4}
                  fill={colors.white}
                  stroke={currentLineColor}
                  strokeWidth={2}
                />
              )}
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
