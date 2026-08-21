import { TrueCostBreakdown } from '../types/backendTypes';

export interface TrueCostInput {
  basePrice: number;
  taxAmount?: number;
  shippingCost?: number;
  installationCost?: number;
  maintenanceCost?: number;
  discountAmount?: number;
  quantity?: number;
  targetBudget?: number;
  incoterms?: string;
  paymentDays?: number;
  defectRatePct?: number;
}

export class TrueCostEngine {
  /**
   * Calculates the True Procurement Cost of a quotation:
   * true_cost = base_price + tax + shipping + installation + maintenance - discount
   *
   * Also computes financial carrying cost and defect risk buffers.
   */
  public static calculate(input: TrueCostInput): TrueCostBreakdown {
    const basePrice = Number(input.basePrice) || 0;
    const taxAmount = Number(input.taxAmount) || 0;
    const shippingAndLogistics = Number(input.shippingCost) || 0;
    const installationCost = Number(input.installationCost) || 0;
    const maintenanceAndSupport = Number(input.maintenanceCost) || 0;
    const discountAmount = Number(input.discountAmount) || 0;
    const quantity = Math.max(1, Number(input.quantity) || 1);
    const targetBudget = Number(input.targetBudget) || (basePrice + taxAmount);

    // Core True Cost Formula
    const totalTrueCost = Math.round(
      basePrice + taxAmount + shippingAndLogistics + installationCost + maintenanceAndSupport - discountAmount
    );

    // Financial carry cost (e.g. Net 45/60 provides credit value, whereas advance payment has interest carry cost)
    const paymentDays = input.paymentDays ?? 30;
    const annualCostOfCapital = 0.10; // 10% annual cost of capital
    // Days > 30 represent positive working capital value; Days < 0 (advance) represent penalty
    const paymentTermCarryCost = Math.round(
      ((30 - paymentDays) / 365) * annualCostOfCapital * totalTrueCost
    );

    // Defect & Risk Buffer based on historical defect rate or default 0.5%
    const defectRate = (input.defectRatePct ?? 0.5) / 100;
    const defectAndRiskBuffer = Math.round(totalTrueCost * defectRate);

    // Risk-Adjusted Cost = Total True Cost + Risk Buffer + Working Capital Carry Cost
    const riskAdjustedCost = totalTrueCost + defectAndRiskBuffer + paymentTermCarryCost;

    // Savings calculations
    const savingsVsBudget = targetBudget - totalTrueCost;
    const savingsPercentage = targetBudget > 0
      ? Number(((savingsVsBudget / targetBudget) * 100).toFixed(2))
      : 0;

    const unitTrueCost = Math.round(totalTrueCost / quantity);

    return {
      basePrice,
      taxAmount,
      shippingAndLogistics,
      installationCost,
      maintenanceAndSupport,
      discountAmount,
      totalTrueCost,
      savingsVsBudget,
      savingsPercentage,
      unitTrueCost,
      paymentTermCarryCost,
      defectAndRiskBuffer,
      riskAdjustedCost
    };
  }
}
