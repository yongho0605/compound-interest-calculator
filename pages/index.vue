<template>
  <div class="flex h-full flex-col justify-around gap-4 text-slate-800">
    <div class="flex justify-between">
      <h1 class="text-3xl">CIRC (Compound Interest Rate Calculator) - 복리 이자 계산기</h1>
      <NuxtLink
        to="https://github.com/yongho0605/compound-interest-rate-calculator"
        target="_blank"
        class="cursor-pointer rounded p-1 hover:bg-slate-100">
        <Icon icon="mdiGithub" class="text-3xl" />
      </NuxtLink>
    </div>
    <div class="flex h-fit flex-col gap-6">
      <InputGroup v-model="investmentInfo" class="flex">
        <Input name="initialInvestmentAmount" type="number" suffix="만원" :min="1">초기 투자 금액</Input>
        <Input name="monthlyInvestment" type="number" suffix="만원" :min="1">월 투자금액</Input>
        <Input name="InterestRate" type="number" suffix="%">복리 이자율</Input>
        <Input name="months" type="number" :min="1">
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
      <InputGroup v-model="investmentInfo.options" class="flex max-h-fit">
        <CheckboxInputs :checkbox-list="checkboxList"></CheckboxInputs>
      </InputGroup>
    </div>
    <div class="">
      <div v-show="data?.length" class="flex w-full justify-between">
        <p>
          (본 계산식은 원금이 그대로 유지된다는 가정 하에 월마다 나오는 배당금을 TR(total return)식으로 재투자하여
          산출된 급액입니다. - 증권거래세 제외)
        </p>
        <span class="mr-2 text-lg font-bold text-red-700">
          적용된 세율:
          {{ withholdingTaxRate }}%
        </span>
      </div>
      <table v-show="data?.length" class="w-full text-center text-xl">
        <tr class="grid border-t border-slate-700" :class="data[0].afterTaxDividend ? 'grid-cols-5' : 'grid-cols-4'">
          <th class="border-r border-slate-700"></th>
          <th class="border-r border-slate-700">투자 금액</th>
          <th v-if="data[0].afterTaxDividend" class="border-r border-slate-700">
            배당금
            <span class="text-sm font-medium">(세후)</span>
          </th>
          <th class="border-r border-slate-700">
            배당금
            <span class="text-sm font-medium">(세전)</span>
          </th>
          <th>원천징수 세액</th>
        </tr>
        <tr
          v-for="item in data"
          :key="item.month"
          class="grid border-t border-slate-700"
          :class="item.afterTaxDividend ? 'grid-cols-5' : 'grid-cols-4'">
          <td class="border-r border-slate-700">{{ item.month }} 개월차</td>
          <td class="border-r border-slate-700">{{ convertToKoreaCurrency(item.valuation * 10000) }}</td>
          <td v-if="item.afterTaxDividend" class="border-r border-slate-700">
            {{ convertToKoreaCurrency(item.afterTaxDividend * 10000) }}
          </td>
          <td class="border-r border-slate-700">{{ convertToKoreaCurrency(item.dividend * 10000) }}</td>
          <td>{{ convertToKoreaCurrency(item.withholdingTax * 10000) }}</td>
        </tr>
      </table>
    </div>
    <div v-if="total" class="flex w-full gap-4 text-xl font-bold">
      <span v-if="total.withholdingTax > 0">세액: {{ currencyFormatter(total.withholdingTax) }}</span>
      <span v-if="total.principalInvestment">투자 원금: {{ currencyFormatter(total.principalInvestment) }}</span>
      <span v-if="total.finalHoldingAmount">보유금: {{ currencyFormatter(total.finalHoldingAmount) }}</span>
      <span v-if="total.rateOfReturn" class="text-red-600">수익률: {{ total.rateOfReturn }}%</span>
    </div>
  </div>
</template>

<script setup>
import CheckboxInputs from '~/components/forms/CheckboxInputs.vue'
import { InvestmentPeriodUnits, Tax } from '~/constant.js'
import { convertToKoreaCurrency, currencyFormatter } from '~/utils/calculator.js'

const investmentInfo = reactive({
  initialInvestmentAmount: 710,
  monthlyInvestment: 80,
  InterestRate: 1.25,
  durationUnit: InvestmentPeriodUnits.YEARLY,
  months: 6,
  options: {
    ISA: false,
    applyWithholdingTax: false
  }
})
const withholdingTaxRate = computed(() =>
  investmentInfo.options.ISA ? Tax.ISA_TAX_RATE : Tax.DEFAULT_WITHHOLDING_TAX_RATE
)
const data = ref([])
const total = ref({})

const interestRateOptions = [
  { key: '개월', value: InvestmentPeriodUnits.MONTHLY },
  { key: '년', value: InvestmentPeriodUnits.YEARLY }
]

const checkboxList = ref([
  {
    title: 'ISA 계좌 사용',
    name: 'ISA',
    description: 'ISA 계좌를 활용해서 투자하면 배당금 원천징수가 해제되며 세율이 9.9%로 설정됩니다. (과세이연 적용)'
  },
  {
    title: '배당금 원청징수 적용',
    name: 'applyWithholdingTax',
    checked: computed(() => investmentInfo.options.applyWithholdingTax),
    description: '원천징수 세금을 적용하시나요? (체크시, 원천징수가 적용된 금액으로 계산됩니다.)',
    disabled: computed(() => investmentInfo.options.ISA)
  }
])

const numberInputGuard = (value) => (!value ? 0 : value)

watch(
  investmentInfo,
  (newValue) => {
    if (newValue.options.ISA && newValue.options.applyWithholdingTax) {
      newValue.options.applyWithholdingTax = false
      return false
    }

    for (const key in newValue) {
      newValue[key] = numberInputGuard(newValue[key])
    }

    const result = calculator({ ...newValue, withholdingTaxRate: Tax.DEFAULT_WITHHOLDING_TAX_RATE })
    if (!result) return false

    data.value = result.data
    total.value = result.total
  },
  { immediate: true }
)
</script>
