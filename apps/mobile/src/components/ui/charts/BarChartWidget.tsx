import React, { useMemo } from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { colors } from '~/src/design/tokens';

export interface BarDataPoint {
  label: string;
  value: number;
}

interface BarChartWidgetProps {
  data: BarDataPoint[];
  height?: number;
  barColor?: string;
  maxValue?: number;
}

export function BarChartWidget({
  data,
  height = 150,
  barColor = colors.brand,
  maxValue,
}: BarChartWidgetProps) {
  const [width, setWidth] = React.useState(0);

  const highest = useMemo(
    () => maxValue || Math.max(...data.map(d => d.value), 1),
    [data, maxValue],
  );

  const onLayout = (e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  };

  const barWidth = width ? Math.max((width / data.length) * 0.6, 12) : 20;
  const gap = width ? (width - barWidth * data.length) / (data.length + 1) : 10;

  return (
    <View style={[styles.container, { height: height + 30 }]} onLayout={onLayout}>
      {width > 0 && (
        <Svg width={width} height={height}>
          <Defs>
            <LinearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={barColor} stopOpacity="1" />
              <Stop offset="100%" stopColor={barColor} stopOpacity="0.2" />
            </LinearGradient>
            <LinearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={colors.bgElevated} stopOpacity="1" />
              <Stop offset="100%" stopColor={colors.bgElevated} stopOpacity="0.3" />
            </LinearGradient>
          </Defs>
          {data.map((item, index) => {
            const x = gap + index * (barWidth + gap);
            const normalizedHeight = (item.value / highest) * height;
            const y = height - normalizedHeight;

            // Find max item to add special glow?
            const isMax = item.value === highest && item.value > 0;

            return (
              <React.Fragment key={index}>
                {/* Background Track */}
                <Rect
                  x={x}
                  y={0}
                  width={barWidth}
                  height={height}
                  rx={barWidth / 2}
                  fill="url(#bgGrad)"
                />
                {/* Active Data Bar */}
                {item.value > 0 && (
                  <Rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={normalizedHeight}
                    rx={barWidth / 2}
                    fill={isMax ? 'url(#barGrad)' : colors.bgElevated}
                    // Add subtle glow to max item
                    stroke={isMax ? barColor : undefined}
                    strokeWidth={isMax ? 1 : 0}
                  />
                )}
              </React.Fragment>
            );
          })}
        </Svg>
      )}

      {/* X-Axis Labels */}
      <View style={styles.xAxis}>
        {data.map((item, index) => (
          <Text key={index} style={[styles.label, { width: barWidth + gap, textAlign: 'center' }]}>
            {item.label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    color: colors.textDisabled,
  },
});
