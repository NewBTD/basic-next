'use client';

import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

type Account = {
  customer_type: string;
  region: string;
  average_balance_6m: number;
};

export default function Page() {
  // สเตตสำหรับเก็บข้อมูลสรุปของแต่ละกราฟ
  const [customerTypes, setCustomerTypes] = useState<{ name: string; value: number }[]>([]);
  const [regions, setRegions]           = useState<{ name: string; value: number }[]>([]);
  const [balanceBuckets, setBalanceBuckets] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    async function loadData() {
      const res = await fetch('/data/savings_accounts__3000.json');
      const accounts: Account[] = await res.json();

      // สร้าง map ชั่วคราว
      const ctMap: Record<string, number> = {};
      const rgMap: Record<string, number> = {};
      const bucketMap: Record<string, number> = {
        'ต่ำกว่า 10K': 0,
        '10K - 50K': 0,
        '50K - 100K': 0,
        '100K ขึ้นไป': 0
      };

      // วนบัญชีทีละรายการด้วย for
      for (let i = 0; i < accounts.length; i++) {
        const acc = accounts[i];

        // นับประเภทลูกค้า
        if (ctMap[acc.customer_type] !== undefined) {
          ctMap[acc.customer_type]++;
        } else {
          ctMap[acc.customer_type] = 1;
        }

        // นับภูมิภาค
        if (rgMap[acc.region] !== undefined) {
          rgMap[acc.region]++;
        } else {
          rgMap[acc.region] = 1;
        }

        // จัด bucket ยอดเงินเฉลี่ย
        const b = acc.average_balance_6m;
        if (b < 10_000) {
          bucketMap['ต่ำกว่า 10K']++;
        } else if (b < 50_000) {
          bucketMap['10K - 50K']++;
        } else if (b < 100_000) {
          bucketMap['50K - 100K']++;
        } else {
          bucketMap['100K ขึ้นไป']++;
        }
      }

      // แปลง ctMap เป็น array ด้วย for…in (ไม่ต้องเช็ค hasOwnProperty กับ literal object)
      const ctArr: { name: string; value: number }[] = [];
      for (const key in ctMap) {
        ctArr.push({ name: key, value: ctMap[key] });
      }
      setCustomerTypes(ctArr);

      // แปลง rgMap เป็น array
      const rgArr: { name: string; value: number }[] = [];
      for (const key in rgMap) {
        rgArr.push({ name: key, value: rgMap[key] });
      }
      setRegions(rgArr);

      // แปลง bucketMap เป็น array
      const bucketArr: { name: string; value: number }[] = [];
      for (const key in bucketMap) {
        bucketArr.push({ name: key, value: bucketMap[key] });
      }
      setBalanceBuckets(bucketArr);
    }

    loadData();
  }, []);

  // สีสำหรับ Pie slices
  const COLORS = ['#4CAF50', '#FF9800', '#2196F3', '#9C27B0'];

  return (
    <main className="p-8 space-y-8 bg-gray-50">
      <h1 className="text-3xl font-bold text-center">Savings Account Dashboard</h1>

      {/* Pie Chart: Customer Types */}
      <Card>
        <CardHeader><CardTitle>ประเภทลูกค้า</CardTitle></CardHeader>
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
        <CardHeader><CardTitle>จำนวนบัญชีตามภูมิภาค</CardTitle></CardHeader>
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
        <CardHeader><CardTitle>การกระจายยอดเงินเฉลี่ย (บาท)</CardTitle></CardHeader>
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
    </main>
  );
}
