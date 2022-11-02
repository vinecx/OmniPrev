import { differenceInDays, format, formatDistance, isAfter } from 'date-fns';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  ImageBackground,
  RefreshControl,
  View,
} from 'react-native';
import { IPreventiva } from '../../../shared/@types/model/preventivas/preventivas';
import PreventivaActions from '../../../shared/@types/model/preventivas/preventivas.actions';
import { Text } from '../../../shared/components/commons/Text';
import { Styled } from '../../../shared/utils/LayoutUtils/BaseStyle';
import Icon from 'react-native-vector-icons/FontAwesome';

import storage from '@react-native-firebase/storage';
import Style from '../../../commons/Style';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { ScreenName } from '../../../routes/screens.enum';
import { ptBR } from 'date-fns/locale';
import ListLoader from '../../../shared/components/loaders/list.loader';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';
import { widthPercentageToDP } from '../../../commons/Dimensions';
import { AbstractChartConfig } from 'react-native-chart-kit/dist/AbstractChart';
import CorretivasActions from '../../../shared/@types/model/corretivas/corretivas.actions';
import { ICorretiva } from '../../../shared/@types/model/corretivas/corretivas';
import { groupBy, groupByAndMap } from '../../../shared/utils/groupBy';
import { Dataset } from 'react-native-chart-kit/dist/HelperTypes';
import { Button } from '../../../shared/components/commons/Button';

const chartConfig: AbstractChartConfig = {
  backgroundGradientFrom: Style.theme.secondary[80],
  backgroundGradientTo: Style.theme.secondary[70],

  decimalPlaces: 0, // optional, defaults to 2dp
  color: (opacity = 1) => `rgba(50,50,255, ${opacity})`,
  labelColor: (opacity = 1) => Style.theme.lighterPrimary,
  barRadius: 10,
  fillShadowGradientOpacity: 1,
  backgroundGradientToOpacity: 0,
  backgroundGradientFromOpacity: 0,
  fillShadowGradientFrom: Style.theme.lighterPrimary,

  fillShadowGradientTo: Style.theme.darkenPrimary,
  fillShadowGradient: Style.theme.darkenSecondary,
  fillShadowGradientFromOffset: 0,
  fillShadowGradientFromOpacity: 1,
  fillShadowGradientToOpacity: 1,

  propsForLabels: {
    fontFamily: 'Poppins Bold',
    fontSize: 12,
  },

  style: {
    borderRadius: 16,
    margin: 25,
  },

  propsForDots: {
    r: '6',
    strokeWidth: '6',
    stroke: Style.theme.lighterPrimary,
  },
};

const Index: React.FC = () => {
  const [preventivas, setPreventivas] = useState<IPreventiva[]>([]);
  const [corretivas, setCorretivas] = useState<ICorretiva[]>([]);
  const [loading, setLoading] = useState(false);

  const Preventivas = new PreventivaActions();
  const Corretivas = new CorretivasActions();

  const getPreventivas = async () => {
    setLoading(true);
    const { data, error } = await Preventivas.buscarTodos();

    if (!error && data) {
      const sorted = [...data].sort((a, b) =>
        new Date(a.data ?? new Date()) > new Date(b.data ?? new Date())
          ? 1
          : -1,
      );
      setPreventivas(sorted);
    }

    setLoading(false);
  };
  const getCorretivas = async () => {
    setLoading(true);
    const { data, error } = await Corretivas.buscarTodos();

    if (!error && data) {
      setCorretivas(data);
    }

    setLoading(false);
  };

  const getAll = () => {
    setLoading(true);
    Promise.all([getPreventivas(), getCorretivas()]).finally(() =>
      setLoading(false),
    );
  };

  useEffect(() => {
    getAll();
  }, []);

  let qtdTarefas = 10;
  let tarefasConcluidas = 0;
  let tarefasComErros = 0;

  preventivas?.forEach(x =>
    x.tarefas.forEach(x => {
      if (x.concluida) {
        tarefasConcluidas += 1;
      } else if (x.error) {
        tarefasComErros += 1;
      }
      qtdTarefas++;
    }),
  );

  const porcentagemConcluidas = (tarefasConcluidas * 100) / qtdTarefas ?? 0;
  const porcentagemErros = (tarefasComErros * 100) / qtdTarefas ?? 0;

  const qtdPreventivas = preventivas?.length ?? 0;
  const qtdCorretivas = corretivas?.length ?? 0;

  const dataPie = [
    {
      name: 'Preventivas',
      population: qtdPreventivas ?? 0,
      color: Style.theme.darkenPrimary,
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
    {
      name: 'Corretivas',
      population: qtdCorretivas ?? 0,
      color: Style.theme.lighterPrimary,
      legendFontColor: '#7F7F7F',
      legendFontSize: 15,
    },
  ];

  //#region  GroupBy's
  const preventivasGroupedByMonth = groupBy(preventivas ?? [], p =>
    format(new Date(p.data), 'MMM/yy', { locale: ptBR }),
  );

  const lineChartData: { labels: string[]; data: number[] } = {
    labels: [],
    data: [],
  };

  preventivasGroupedByMonth.forEach((preventivasData, month) => {
    lineChartData.labels.push(month);
    lineChartData.data.push(preventivasData.length);
  });

  //#endregion`

  let tarefasConcluidasComAtraso = 0;
  let tarefasNaoConcluidasComAtraso = 0;

  preventivas.forEach(x => {
    x.tarefas.forEach(t => {
      const realizadaComSucesso = !!t.concluida;
      const realizadaComErro = !!t.error;
      const naoRealizada = !realizadaComSucesso && !realizadaComErro;

      const dataRealizada = naoRealizada
        ? new Date()
        : new Date(t.concluida?.data ?? t.error?.data ?? new Date());

      if (isAfter(dataRealizada, new Date(x.data))) {
        if (naoRealizada) {
          tarefasNaoConcluidasComAtraso += 1;
        } else {
          tarefasConcluidasComAtraso += 1;
        }
      }
    });
  });

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={loading}
          title="Carregando preventivas"
          onRefresh={() => getAll()}
        />
      }
      bounces>
      <Button
        leftIcon={<Icon name="refresh" size={20} color="white" />}
        title="Recarregar dados"
        variance={'darkenPrimary'}
        size={'xxsm'}
        onPress={getPreventivas}
        margin={15}
      />

      <Styled type="row" css="padding: 25px" justifyContent="space-evenly">
        <Styled type="col" justifyContent="center">
          <Text
            fontFamily="Poppins SemiBold"
            variance="secondary"
            alignText="center"
            fontSize={12}>
            Total {'\n'}de tarefas
          </Text>
          <Text
            fontFamily="Poppins SemiBold"
            variance="darkenPrimary"
            alignText="center"
            fontSize={35}>
            {qtdTarefas}
          </Text>
        </Styled>

        <Styled type="col" justifyContent="center">
          <Text
            fontFamily="Poppins SemiBold"
            variance="secondary"
            alignText="center"
            fontSize={12}>
            Finalizadas {'\n'}com sucesso
          </Text>
          <Text
            fontFamily="Poppins SemiBold"
            variance="darkenPrimary"
            alignText="center"
            fontSize={35}>
            {porcentagemConcluidas.toPrecision(2)}%
          </Text>
        </Styled>
        <Styled>
          <Text
            fontFamily="Poppins SemiBold"
            variance="secondary"
            alignText="center"
            fontSize={12}>
            Finalizadas {'\n'}com erros
          </Text>
          <Text
            fontFamily="Poppins Bold"
            variance="danger"
            alignText="center"
            fontSize={35}>
            {porcentagemErros.toPrecision(2)}%
          </Text>
        </Styled>
      </Styled>

      <Styled type="row" css="padding: 25px" justifyContent="space-evenly">
        <Styled type="col" justifyContent="center">
          <Text
            fontFamily="Poppins SemiBold"
            variance="secondary"
            alignText="center"
            fontSize={12}>
            Concluídas {'\n'}com atraso
          </Text>
          <Text
            fontFamily="Poppins Bold"
            variance="danger"
            alignText="center"
            fontSize={35}>
            {tarefasConcluidasComAtraso}
          </Text>
        </Styled>

        <Styled type="col" justifyContent="center">
          <Text
            fontFamily="Poppins SemiBold"
            variance="secondary"
            alignText="center"
            fontSize={12}>
            Não finalizadas {'\n'}com atraso
          </Text>
          <Text
            fontFamily="Poppins Bold"
            variance="danger"
            alignText="center"
            fontSize={35}>
            {tarefasNaoConcluidasComAtraso}
          </Text>
        </Styled>
      </Styled>

      <Styled type="container" justifyContent="center" alignItems="center">
        {/* <LineChart
          data={{
            labels: lineChartData.labels,
            datasets: [{ data: lineChartData.data }],
          }}
          width={widthPercentageToDP('90')} // from react-native
          height={220}
          bezier
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{ ...chartConfig, decimalPlaces: 0 }}
          style={{
            borderRadius: 20,
            marginVertical: 25,
          }}
        /> */}
        <Text fontFamily="Poppins SemiBold" variance="secondary" fontSize={13}>
          Preventivas / Mês
        </Text>
        <BarChart
          data={{
            labels: lineChartData.labels,
            datasets: [
              {
                data: lineChartData.data,
              },
            ],
          }}
          fromZero
          width={widthPercentageToDP('100')} // from react-native
          height={200}
          // yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            ...chartConfig,
          }}
          showBarTops={false}
          style={{
            borderRadius: 20,
            marginVertical: 25,
          }}
        />

        <Text
          marginTop={45}
          fontFamily="Poppins SemiBold"
          variance="secondary"
          fontSize={13}>
          Preventivas / corretivas
        </Text>
        <PieChart
          data={dataPie}
          width={widthPercentageToDP('100')} // from react-native
          height={200}
          hasLegend
          chartConfig={chartConfig}
          accessor={'population'}
          center={[30, -10]}
          absolute
        />
      </Styled>
    </ScrollView>
  );
};

export default Index;
