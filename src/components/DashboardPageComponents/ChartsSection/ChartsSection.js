import React, { useEffect, useRef } from "react";
import * as echarts from "echarts";
import "./ChartsSection.css";

const ChartsSection = ({ expenses }) => {
  const pieChartRef = useRef(null);
  const trendChartRef = useRef(null);

  // Category Wise Data for Pie Chart
  const getCategoryWiseData = () => {
    const categoryMap = {};

    expenses.forEach((exp) => {
      categoryMap[exp.category] = (categoryMap[exp.category] || 0) + exp.amount;
    });

    return Object.entries(categoryMap).map(([category, amount]) => ({
      name: category,
      value: amount,
    }));
  };

  // Month + Year Wise Data for Line Chart
  const getMonthYearWiseData = () => {
    const monthMap = {};

    expenses.forEach((exp) => {
      const dateObj = new Date(exp.date);
      const year = dateObj.getFullYear();
      const month = dateObj.toLocaleString("default", { month: "short" });
      const key = `${month} ${year}`;

      monthMap[key] = (monthMap[key] || 0) + exp.amount;
    });

    return Object.entries(monthMap)
      .sort((a, b) => new Date(`1 ${a[0]}`) - new Date(`1 ${b[0]}`))
      .map(([monthYear, amount]) => ({
        monthYear,
        amount,
      }));
  };

  useEffect(() => {
    if (!expenses.length) return;

    const categoryData = getCategoryWiseData();
    const monthYearData = getMonthYearWiseData();

    if (pieChartRef.current) {
      const pieChart = echarts.init(pieChartRef.current);
      const pieOption = {
        backgroundColor: 'transparent',
        tooltip: { trigger: "item", textStyle: { color: '#fff' } },
        legend: {
          show: true,
          bottom: 0,
          textStyle: { color: "#fff" }
        },
        series: [
          {
            type: "pie",
            radius: ["42%", "70%"],
            label: {
              show: true,
              formatter: "{b}: {c} ({d}%)",
              color: "#fff",
            },
            labelLine: {
              lineStyle: {
                color: '#fff'
              }
            },
            data: categoryData,
            emphasis: {
              itemStyle: {
                shadowBlur: 15,
                shadowOffsetX: 0,
                shadowColor: "rgba(255, 255, 255, 0.3)",
              },
            },
          },
        ],
      };
      
      pieChart.setOption(pieOption);
    }

    if (trendChartRef.current) {
      const trendChart = echarts.init(trendChartRef.current);
      const trendOption = {
        backgroundColor: 'transparent',
        tooltip: {
          trigger: "axis",
          backgroundColor: "rgba(0, 0, 0, 0.8)",  // dark background
          borderColor: "#00c0ff",                 // optional: matches line color
          borderWidth: 1,
          textStyle: {
            color: "#fff",                        // bright text for dark background
            fontSize: 14,
          },
        },
        xAxis: {
          type: "category",
          data: monthYearData.map((item) => item.monthYear),
          axisLine: { lineStyle: { color: "#ccc" } },
          axisLabel: { color: "#fff" },
        },
        yAxis: {
          type: "value",
          axisLine: { lineStyle: { color: "#ccc" } },
          axisLabel: { color: "#fff" },
          splitLine: {
            lineStyle: { color: "rgba(255,255,255,0.1)" },
          },
        },
        series: [
          {
            name: "Expenses",
            data: monthYearData.map((item) => item.amount),
            type: "line",
            smooth: true,
            lineStyle: {
              color: "#00c0ff",
              width: 3,
            },
            itemStyle: {
              color: "#00c0ff",
            },
            label: {
              show: true,
              position: "top",
              fontSize: 14,
              color: "#fff",
            },
          },
        ],
      };
      
      trendChart.setOption(trendOption);
    }
  }, [expenses]);

  return (
    <div className="charts-container">
      <div className="chart-card">
        <h3 className="chart-title">Spending by Category</h3>
        <div className="chart-container" ref={pieChartRef}></div>
      </div>

      <div className="chart-card">
        <h3 className="chart-title">Spending Trends</h3>
        <div className="chart-container" ref={trendChartRef}></div>
      </div>
    </div>
  );
};

export default ChartsSection;
