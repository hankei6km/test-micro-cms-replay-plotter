import { useState, useEffect } from 'react';

export type Series = {
  name: string;
  data: number[];
}[];

// ApexCharts は next/dynamic でも useEffect まで待つ必要あるから、
// 記述的にはあまり変わらない.
// どちらを使う方が良いのか?
export default function Plotter({ series }: { series: Series }) {
  //const [plotter, setPlotter] = useState<null | Element>(null);
  const [plotter, setPlotter] = useState<null | Element>(null);
  // https://stackoverflow.com/questions/55151041/window-is-not-defined-in-next-js-react-app
  useEffect(() => {
    const importChart = async () => {
      const Chart = (await import('react-apexcharts')).default;
      setPlotter(
        <Chart
          options={{
            chart: {
              type: 'line'
            },
            legend: {
              show: true,
              showForSingleSeries: true
            }
          }}
          series={series}
        />
      );
    };
    importChart();
  }, [series]);
  return <div>{plotter}</div>;
}

// https://nextjs.org/docs/advanced-features/dynamic-import
// import dynamic from 'next/dynamic';
//
// export default function Plotter({ series }) {
//   const [plotter, setPlotter] = useState();
//   useEffect(() => {
//     const importChart = async () => {
//       const Chart = dynamic(() => import('react-apexcharts'));
//
//       setPlotter(
//         <Chart
//           options={{
//             chart: {
//               type: 'line'
//             }
//           }}
//           series={series}
//         />
//       );
//     };
//     importChart();
//   }, [series]);
//   return <div>{plotter}</div>;
// }
