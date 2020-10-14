import { ReactElement, useState, useEffect, useCallback } from 'react';
import ReactApexChart from 'react-apexcharts';
import utilStyles from '../styles/utils.module.css';

export type Series = {
  name: string;
  data: number[];
}[];

// ApexCharts は next/dynamic でも useEffect まで待つ必要あるから、
// 記述的にはあまり変わらない.
// どちらを使う方が良いのか?
export default function Plotter({ series }: { series: Series }) {
  const [chart, setChart] = useState<null | typeof ReactApexChart>(null);
  const [plotter, setPlotter] = useState<null | ReactElement<any>>(null);
  const [plotterHeight, setPlotterHeight] = useState(''); // 文字列で扱う、mount時の値が設定される、変更は ApexChart 側が内部で処理している

  const ref = useCallback(
    (node) => {
      if (node != null) {
        // https://apexcharts.com/docs/options/chart/height/
        // 微妙にずれる、'auto' は使わわずに近似値で明示する
        const h = node.getBoundingClientRect().width * 0.62;
        setPlotterHeight(`${h}`);
        if (plotter === null) {
          setPlotter(
            <div style={{ height: h }} className={utilStyles.plotterRect} />
          );
        }
      }
    },
    [plotter]
  );

  // https:stackoverflow.com/questions/55151041/window-is-not-defined-in-next-js-react-app
  useEffect(() => {
    // useEffect も依存によっては 毎回 import を実行しそうなのでわけた.
    // が、現状ではあまり意味はないか?
    if (chart === null) {
      // console.log('!!!! import');
      const importChart = async () => {
        const c = (await import('react-apexcharts')).default;
        setChart((prev) => c);
      };
      importChart();
    }
  }, [chart]);

  useEffect(() => {
    if (chart !== null && plotterHeight !== '') {
      // console.log('!!!! effect');
      // const Chart = (await import('react-apexcharts')).default;
      const Chart = chart;
      setPlotter(
        <Chart
          options={{
            chart: {
              type: 'line',
              height: plotterHeight,
              parentHeightOffset: 0
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
    }
  }, [series, chart, plotterHeight]);

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
