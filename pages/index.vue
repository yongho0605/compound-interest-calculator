<template>
  <div class="flex h-[40vh] flex-col justify-around gap-4">
    <h1 class="text-4xl">CIRC (Compound Interest Rate Calculator) - 복리 이자 계산기</h1>
    <div class="flex h-[30vh]">
      <Input v-model="calculateTarget.currentInvestmentAmount" type="number" suffix="만원" min="1">
        현재 투자 금액
      </Input>
      <Input v-model="calculateTarget.monthlyInvestment" type="number" suffix="만원" min="1">월 투자금액</Input>
      <Input v-model="calculateTarget.InterestRate" type="number" suffix="%">복리 이자율</Input>
      <Input v-model="calculateTarget.months" type="number" min="1">
        투자 기간
        <template #suffix>
          <Input
            v-model="calculateTarget.InterestUnit"
            input-class="w-full rounded border border-slate-600 p-2"
            type="select"
            :options="interestRateOptions" />
        </template>
      </Input>
    </div>
    <div>
      <div v-if="data.length" class="flex w-full justify-between">
        <p>(본 정보는 원금 손실을 가정하지 않은, 원금이 그대로 유지된다는 가정하에 계산된 수치입니다.)</p>
      </div>
      <table class="w-full text-center text-xl">
        <tr v-if="data.length" class="grid grid-cols-4 border-t border-slate-700">
          <th class="border-r border-slate-700"></th>
          <th class="border-r border-slate-700">투자 금액</th>
          <th class="border-r border-slate-700">분배금</th>
          <th>원천징수 세액</th>
        </tr>
        <tr v-for="item in data" :key="item.month" class="grid grid-cols-4 border-t border-slate-700">
          <td class="border-r border-slate-700">{{ item.month }} 개월차</td>
          <td class="border-r border-slate-700">{{ convertToKoreaCurrency(item.valuation * 10000) }}</td>
          <td class="border-r border-slate-700">{{ convertToKoreaCurrency(item.dividend * 10000) }}</td>
          <td>{{ convertToKoreaCurrency(truncateTwoDecimalPlaces(item.withholdingTax * 10000)) }}</td>
        </tr>
      </table>
    </div>
    <div class="flex w-full gap-4 text-xl font-bold">
      <span v-if="total.withholdingTax > 0">총 원천징수 세액: {{ currencyFormatter(total.withholdingTax) }}</span>
      /
      <span v-if="total.principalInvestment">총 투자 원금: {{ currencyFormatter(total.principalInvestment) }}</span>
      /
      <span v-if="total.finalHoldingAmount">최종 보유금: {{ currencyFormatter(total.finalHoldingAmount) }}</span>
    </div>
  </div>
</template>

<script setup>
import { investmentPeriodUnits } from '~/constant.js'
import { truncateTwoDecimalPlaces, convertToKoreaCurrency, currencyFormatter } from '~/utils/calculator.js'
const { MONTHLY, YEARLY } = investmentPeriodUnits

const calculateTarget = reactive({
  currentInvestmentAmount: 710,
  monthlyInvestment: 100,
  InterestRate: 1.25,
  InterestUnit: YEARLY,
  months: 6
})
const data = ref([])
const total = ref({ withholdingTax: 0 })

const interestRateOptions = [
  { key: '개월', value: MONTHLY },
  { key: '년', value: YEARLY }
]

watch(
  calculateTarget,
  (value) => {
    const result = calculator(value)
    data.value = result.data
    total.value = result.total
  },
  { immediate: true }
)
</script>
