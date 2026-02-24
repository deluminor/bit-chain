import * as d3Shape from 'd3-shape';
import React, { useMemo } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { colors } from '~/src/design/tokens';

export interface Point {
  x: number;
  y: number;
}

interface LineChartWidgetProps {
  data: number[];
  height?: number;
  lineColor?: string;
  showDot?: boolean;
}

export function LineChartWidget({
  data,
  height = 80,
  lineColor = colors.brand,
  showDot = true,
}: LineChartWidgetProps) {
  const [width, setWidth] = React.useState(0);

  const onLayout = (e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  };

  const { path, areaPath, lastPoint } = useMemo(() => {
    if (width === 0 || data.length === 0) {
      return { path: '', areaPath: '', lastPoint: null };
    }

    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = max - min;

    const points: Point[] = data.map((d, i) => ({
      x: (i / Math.max(data.length - 1, 1)) * width,
      y: height - ((d - min) / (range || 1)) * height * 0.8 - 10, // 10px padding top/bottom
    }));

    const lineGenerator = d3Shape
      .line<Point>()
      .x(d => d.x)
      .y(d => d.y)
      .curve(d3Shape.curveMonotoneX);

    const areaGenerator = d3Shape
      .area<Point>()
      .x(d => d.x)
      .y0(height)
      .y1(d => d.y)
      .curve(d3Shape.curveMonotoneX);

    return {
      path: lineGenerator(points) || '',
      areaPath: areaGenerator(points) || '',
      lastPoint: points[points.length - 1],
    };
  }, [data, width, height]);

  return (
    <View style={[styles.container, { height }]} onLayout={onLayout}>
      {width > 0 && data.length > 0 && (
        <Svg width={width} height={height}>
          <Defs>
            <LinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={lineColor} stopOpacity="0.4" />
              <Stop offset="100%" stopColor={lineColor} stopOpacity="0" />
            </LinearGradient>
          </Defs>
          <Path d={areaPath} fill="url(#areaGrad)" />
          <Path d={path} fill="none" stroke={lineColor} strokeWidth={2} />
          {showDot && lastPoint && (
            <Circle
              cx={lastPoint.x}
              cy={lastPoint.y}
              r={4}
              fill="#fff"
              stroke={lineColor}
              strokeWidth={2}
            />
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
