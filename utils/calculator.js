import { investmentPeriodUnits } from '~/constant.js'

const monthsConverter = (unit) => {
  switch (unit) {
    case investmentPeriodUnits.MONTHLY:
      return 1
    case investmentPeriodUnits.YEARLY:
      return 12
    default:
      break
  }
}

const convertToPercentage = (value) => value * 0.01
const withholdingTaxRate = 15.4

export const currencyFormatter = (value) => {
  const tenK = '만 원'
  const hundredMillion = '억 원'
  const trillion = '조 원'

  const result = value
  if (value > 10000) {
    const result = (value / 10000).toFixed(2)
    return result.toLocaleString('ko-KR') + hundredMillion
  } else if (value > 100000000) {
    const result = value / 100000000
    return result.toLocaleString('ko-KR') + trillion
  }

  return result.toLocaleString('ko-KR') + tenK
}
export const truncateTwoDecimalPlaces = (value) => parseFloat(value.toFixed(2))
export const convertToKoreaCurrency = (value) => value.toLocaleString('ko-KR', { style: 'currency', currency: 'KRW' })
export const calculator = ({ currentInvestmentAmount, monthlyInvestment, InterestRate, InterestUnit, months }) => {
  let _currentInvestmentAmount = currentInvestmentAmount
  const result = []
  const investmentPeriod = months * monthsConverter(InterestUnit)
  InterestRate = convertToPercentage(InterestRate)

  for (let i = 1; i <= investmentPeriod; i++) {
    const dividend = Math.floor(_currentInvestmentAmount * InterestRate)
    const withholdingTax = dividend * convertToPercentage(withholdingTaxRate)
    const roundedWithholdingTax = truncateTwoDecimalPlaces(withholdingTax)

    _currentInvestmentAmount = _currentInvestmentAmount + dividend + monthlyInvestment
    result.push({ month: i, valuation: _currentInvestmentAmount, dividend, withholdingTax: roundedWithholdingTax })
  }

  const totalWithholdingTax = result.reduce((acc, { withholdingTax }) => acc + withholdingTax, 0)
  const totalPrincipalInvestment = monthlyInvestment * investmentPeriod
  const finalHoldingAmount = result[result.length - 1].valuation + result[result.length - 1].dividend

  return {
    data: result,
    total: {
      withholdingTax: truncateTwoDecimalPlaces(totalWithholdingTax),
      principalInvestment: totalPrincipalInvestment,
      finalHoldingAmount
    }
  }
}
