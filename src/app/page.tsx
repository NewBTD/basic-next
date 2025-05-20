"use client";

import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ChartTest } from "./ChartTest";

type Account = {
  customer_type: string;
  region: string;
  average_balance_6m: number;
};

export default function Page() {
  // สเตตสรุปข้อมูลแต่ละกราฟ
  const [customerTypes, setCustomerTypes] = useState<
    { name: string; value: number }[]
  >([]);
  const [regions, setRegions] = useState<{ name: string; value: number }[]>([]);
  const [balanceBuckets, setBalanceBuckets] = useState<
    { name: string; value: number }[]
  >([]);

  useEffect(() => {
    async function loadData() {
      const res = await fetch("/data/savings_accounts__3000.json");
      const accounts: Account[] = await res.json();

      // เตรียมตัวเก็บค่ากลาง
      const ctMap: Record<string, number> = {};
      const rgMap: Record<string, number> = {};
      const bucketMap: Record<string, number> = {
        "ต่ำกว่า 10K": 0,
        "10K - 50K": 0,
        "50K - 100K": 0,
        "100K ขึ้นไป": 0,
      };

      // ใช้ forEach สรุปค่า
      accounts.forEach((item) => {
        // customer_type
        const ct = item.customer_type;
        ctMap[ct] = (ctMap[ct] || 0) + 1;

        // region
        const rg = item.region;
        rgMap[rg] = (rgMap[rg] || 0) + 1;

        // average_balance → bucket
        const b = item.average_balance_6m;
        if (b < 10_000) {
          bucketMap["ต่ำกว่า 10K"]++;
        } else if (b < 50_000) {
          bucketMap["10K - 50K"]++;
        } else if (b < 100_000) {
          bucketMap["50K - 100K"]++;
        } else {
          bucketMap["100K ขึ้นไป"]++;
        }
      });

      // แปลงแต่ละ Map เป็น Array ด้วย for…in แล้ว set state
      const ctArr: { name: string; value: number }[] = [];
      for (const key in ctMap) {
        ctArr.push({ name: key, value: ctMap[key] });
      }
      setCustomerTypes(ctArr);

      const rgArr: { name: string; value: number }[] = [];
      for (const key in rgMap) {
        rgArr.push({ name: key, value: rgMap[key] });
      }
      setRegions(rgArr);

      const bucketArr: { name: string; value: number }[] = [];
      for (const key in bucketMap) {
        bucketArr.push({ name: key, value: bucketMap[key] });
      }
      setBalanceBuckets(bucketArr);

      // ดูผลลัพธ์ในคอนโซลได้เลย
      console.log("customerTypeCount", ctMap);
      console.log("regionCount", rgMap);
      console.log("bucketCount", bucketMap);
    }

    loadData();
  }, []);

  const COLORS = ["#4CAF50", "#FF9800", "#2196F3", "#9C27B0"];

  return (
    <main className="p-8 space-y-8 bg-gray-50">
      <h1 className="text-3xl font-bold text-center">
        Savings Account Dashboard
      </h1>

      {/* Pie Chart: Customer Types */}
      <Card>
        <CardHeader>
          <CardTitle>ประเภทลูกค้า</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={customerTypes}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {customerTypes.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bar Chart: Regions */}
      <Card>
        <CardHeader>
          <CardTitle>จำนวนบัญชีตามภูมิภาค</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={regions}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#03A9F4" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bar Chart: Balance Buckets */}
      <Card>
        <CardHeader>
          <CardTitle>การกระจายยอดเงินเฉลี่ย (บาท)</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={balanceBuckets}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#9C27B0" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <ChartTest />
    </main>
  );
}
