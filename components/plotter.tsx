import { ReactElement, useState, useEffect, useCallback } from 'react';
import utilStyles from '../styles/utils.module.css';

export type Series = {
  name: string;
  data: number[];
}[];

// ApexCharts は next/dynamic でも useEffect まで待つ必要あるから、
// 記述的にはあまり変わらない.
// どちらを使う方が良いのか?
export default function Plotter({ series }: { series: Series }) {
  //const [plotter, setPlotter] = useState<null | Element>(null);
  const [plotter, setPlotter] = useState<null | ReactElement<any>>(null);

  const ref = useCallback(
    (node) => {
      if (node != null && plotter === null) {
        // https://apexcharts.com/docs/options/chart/height/
        // 微妙にずれる、計算方法間違えてしまったか?
        // TODO: plotter の高さに auto を使わないことも検討.
        const h = node.getBoundingClientRect().width * 0.62109;
        setPlotter(
          <div style={{ height: h }} className={utilStyles.plotterRect} />
        );
      }
    },
    [plotter]
  );

  // https:stackoverflow.com/questions/55151041/window-is-not-defined-in-next-js-react-app
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
            },
            xaxis: {
              tickAmount: 10
            }
          }}
          series={series}
        />
      );
    };
    importChart();
  }, [series]);

  return <div ref={ref}>{plotter}</div>;
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
