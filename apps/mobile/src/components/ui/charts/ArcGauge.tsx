import * as d3Shape from 'd3-shape';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G, Path } from 'react-native-svg';
import { colors } from '~/src/design/tokens';

interface ArcSegment {
  value: number;
  color: string;
  label?: string;
}

interface ArcGaugeProps {
  segments: ArcSegment[];
  size?: number;
  strokeWidth?: number;
  title?: string;
  subtitle?: string;
}

export function ArcGauge({
  segments,
  size = 200,
  strokeWidth = 20,
  title,
  subtitle,
}: ArcGaugeProps) {
  const radius = size / 2;
  const innerRadius = radius - strokeWidth;

  // Calculate generic paths
  const arcs = useMemo(() => {
    const total = segments.reduce((sum, s) => sum + s.value, 0) || 1; // Prevent division by zero
    const pie = d3Shape
      .pie<ArcSegment>()
      .value(d => d.value)
      .sort(null)
      .startAngle(-Math.PI / 2) // Start from left (90 deg CCW)
      .endAngle(Math.PI / 2); // End at right (90 deg CW)

    const pieData = pie(segments);

    const arcGenerator = d3Shape
      .arc<d3Shape.PieArcDatum<ArcSegment>>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .cornerRadius(strokeWidth / 2)
      .padAngle(0.04); // Gap between segments

    return pieData.map((data, index) => {
      // Calculate dot position (end of the arc)
      const centroid = arcGenerator.centroid(data as any) || [0, 0];
      const isEnd = index === pieData.length - 1; // Dot only for the last?
      // Actually, the dot is usually at the edge of the active progress.
      // For now, let's just render the arc paths.

      return {
        path: arcGenerator(data as any) || undefined,
        color: data.data.color,
        centroid,
        isLast: isEnd,
      };
    });
  }, [segments, innerRadius, radius, strokeWidth]);

  return (
    <View style={[styles.container, { width: size, height: radius + 20 }]}>
      <Svg width={size} height={radius + strokeWidth}>
        <G x={radius} y={radius}>
          {/* Background arc */}
          <Path
            d={
              d3Shape
                .arc()
                .innerRadius(innerRadius)
                .outerRadius(radius)
                .startAngle(-Math.PI / 2)
                .endAngle(Math.PI / 2)({} as any) || undefined
            }
            fill={colors.bgSurface}
          />

          {/* Foreground segments */}
          {arcs.map((arc, i) => (
            <React.Fragment key={i}>
              <Path d={arc.path} fill={arc.color} />
              {/* Optional glow dot at the end of the last segment */}
              {arc.isLast && segments.length > 0 && segments[0].value > 0 && (
                <Circle cx={arc.centroid[0]} cy={arc.centroid[1]} r={strokeWidth / 3} fill="#fff" />
              )}
            </React.Fragment>
          ))}
        </G>
      </Svg>

      {/* Center text overlay */}
      <View style={styles.centerTextContainer}>
        {title && <Text style={styles.title}>{title}</Text>}
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  centerTextContainer: {
    position: 'absolute',
    bottom: 0,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Outfit_600SemiBold',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: colors.textSecondary,
    marginTop: 4,
  },
});
