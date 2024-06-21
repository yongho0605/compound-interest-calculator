<template>
  <div class="flex h-full flex-col justify-around gap-4 text-slate-800">
    <div class="flex justify-between">
      <h1 class="text-3xl">CIRC (Compound Interest Rate Calculator) - 복리 이자 계산기</h1>
      <NuxtLink
        class="cursor-pointer rounded p-1 hover:bg-slate-100"
        to="https://github.com/yongho0605/compound-interest-rate-calculator"
        target="_blank">
        <Icon icon="mdiGithub" class="text-3xl" />
      </NuxtLink>
    </div>
    <div class="flex h-[10vh]">
      <InputGroup v-model="investmentInfo" class="flex">
        <Input name="initialInvestmentAmount" type="number" suffix="만원" min="1">초기 투자 금액</Input>
        <Input name="monthlyInvestment" type="number" suffix="만원" min="1">월 투자금액</Input>
        <Input name="InterestRate" type="number" suffix="%">복리 이자율</Input>
        <Input name="months" type="number" min="1">
          투자 기간
          <template #suffix>
            <Input
              class="w-full"
              name="durationUnit"
              input-class="w-2/3 rounded border border-slate-600 p-2"
              type="select"
              :options="interestRateOptions" />
          </template>
        </Input>
      </InputGroup>
      <InputGroup v-model="investmentInfo.options"></InputGroup>
    </div>
    <div>
      <div v-show="data?.length" class="flex w-full justify-between">
        <p>
          (본 정보는 원금이 그대로 유지된다는 가정 하에 월마다 나오는 배당금을 TR(total return)식으로 재투자하여 산출된
          급액입니다.)
        </p>
        <span class="mr-2 text-lg font-bold text-red-700">적용된 세율: {{ Tax.WITHHOLDING_TAX_RATE }}%</span>
      </div>
      <table v-show="data?.length" class="w-full text-center text-xl">
        <tr class="grid grid-cols-4 border-t border-slate-700">
          <th class="border-r border-slate-700"></th>
          <th class="border-r border-slate-700">투자 금액</th>
          <th class="border-r border-slate-700">배당금</th>
          <th>원천징수 세액</th>
        </tr>
        <tr v-for="item in data" :key="item.month" class="grid grid-cols-4 border-t border-slate-700">
          <td class="border-r border-slate-700">{{ item.month }} 개월차</td>
          <td class="border-r border-slate-700">{{ convertToKoreaCurrency(item.valuation * 10000) }}</td>
          <td class="border-r border-slate-700">{{ convertToKoreaCurrency(item.dividend * 10000) }}</td>
          <td>{{ convertToKoreaCurrency(item.withholdingTax * 10000) }}</td>
        </tr>
      </table>
    </div>
    <div v-if="total" class="flex w-full gap-4 text-xl font-bold">
      <span v-if="total.withholdingTax > 0">총 원천징수 세액: {{ currencyFormatter(total.withholdingTax) }}</span>
      <span v-if="total.principalInvestment">총 투자 원금: {{ currencyFormatter(total.principalInvestment) }}</span>
      <span v-if="total.finalHoldingAmount">최종 보유금: {{ currencyFormatter(total.finalHoldingAmount) }}</span>
      <span v-if="total.rateOfReturn" class="text-red-600">수익률: {{ total.rateOfReturn }}%</span>
    </div>
  </div>
</template>

<script setup>
import { InvestmentPeriodUnits, Tax } from '~/constant.js'
import { convertToKoreaCurrency, currencyFormatter } from '~/utils/calculator.js'

const investmentInfo = reactive({
  initialInvestmentAmount: 0,
  monthlyInvestment: 0,
  InterestRate: 0,
  durationUnit: InvestmentPeriodUnits.MONTHLY,
  months: 1,
  options: {
    ISA: false
  }
})
const data = ref([])
const total = ref({})

const interestRateOptions = [
  { key: '개월', value: InvestmentPeriodUnits.MONTHLY },
  { key: '년', value: InvestmentPeriodUnits.YEARLY }
]

const numberInputGuard = (value) => (!value ? 0 : value)

watch(investmentInfo, (value) => {
  for (const key in value) {
    value[key] = numberInputGuard(value[key])
  }

  const result = calculator({ ...value, withholdingTaxRate: Tax.WITHHOLDING_TAX_RATE })
  if (!result) return false

  data.value = result.data
  total.value = result.total
})
</script>
