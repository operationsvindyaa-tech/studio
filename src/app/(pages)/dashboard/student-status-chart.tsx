"use client";

import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Circle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type StudentStatusData = {
  name: string;
  value: number;
  fill: string;
};

type StudentStatusChartProps = {
  data: StudentStatusData[];
  totalStudents: number;
};

export function StudentStatusChart({ data, totalStudents }: StudentStatusChartProps) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Student Status</CardTitle>
        <CardDescription>Distribution of active, inactive, and suspended students.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <div className="w-full h-64 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Tooltip
                        contentStyle={{
                            background: "hsl(var(--background))",
                            borderColor: "hsl(var(--border))",
                            borderRadius: "var(--radius)"
                        }}
                    />
                    <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} labelLine={false} label>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-bold">{totalStudents}</span>
                <span className="text-sm text-muted-foreground">Total Students</span>
            </div>
        </div>
      </CardContent>
        <CardContent className="flex justify-center gap-4 text-sm">
            {data.map(entry => (
                <div key={entry.name} className="flex items-center gap-2">
                    <Circle className="h-3 w-3" style={{ fill: entry.fill, color: entry.fill }}/>
                    <span>{entry.name}</span>
                </div>
            ))}
        </CardContent>
    </Card>
  );
}
