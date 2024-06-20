import { InvestmentPeriodUnits } from '~/constant.js'

const monthsConverter = (unit) => {
  switch (unit) {
    case InvestmentPeriodUnits.MONTHLY:
      return 1
    case InvestmentPeriodUnits.YEARLY:
      return 12
    default:
      break
  }
}

const convertToHundredth = (value) => value * 0.01
const convertToPercentage = (value) => value * 100
const calculateRateOfReturn = (totalAmount, totalInvestment) => {
  const originRORValue = (totalAmount - totalInvestment) / totalInvestment
  const purifiedRORValue = truncateTwoDecimalPlaces(convertToPercentage(originRORValue))

  if (purifiedRORValue === Infinity) {
    return 0
  }
  return purifiedRORValue
}

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
export const calculator = ({
  initialInvestmentAmount,
  monthlyInvestment,
  InterestRate,
  durationUnit,
  months,
  withholdingTaxRate = 15.4
}) => {
  const result = []
  if (isNaN(months)) return false

  let _currentInvestmentAmount = initialInvestmentAmount
  const investmentPeriod = months * monthsConverter(durationUnit)
  InterestRate = convertToHundredth(InterestRate)

  for (let i = 1; i <= investmentPeriod; i++) {
    const dividend = Math.floor(_currentInvestmentAmount * InterestRate)
    const withholdingTax = dividend * convertToHundredth(withholdingTaxRate)
    const roundedWithholdingTax = truncateTwoDecimalPlaces(withholdingTax)

    _currentInvestmentAmount = _currentInvestmentAmount + dividend + monthlyInvestment
    result.push({ month: i, valuation: _currentInvestmentAmount, dividend, withholdingTax: roundedWithholdingTax })
  }

  if (result.length <= 0) return false

  const totalWithholdingTax = result.reduce((acc, { withholdingTax }) => acc + withholdingTax, 0)
  const totalPrincipalInvestment = monthlyInvestment * investmentPeriod + initialInvestmentAmount
  const finalHoldingAmount = result[result.length - 1].valuation + result[result.length - 1].dividend
  const rateOfReturn = calculateRateOfReturn(finalHoldingAmount, totalPrincipalInvestment)

  return {
    data: result,
    total: {
      withholdingTax: truncateTwoDecimalPlaces(totalWithholdingTax),
      principalInvestment: totalPrincipalInvestment,
      finalHoldingAmount,
      rateOfReturn
    }
  }
}
