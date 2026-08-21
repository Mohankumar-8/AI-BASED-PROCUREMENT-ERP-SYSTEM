import { db } from '../db/database';
import { VendorProfile } from '../types/backendTypes';

export class VendorService {
  public static getAll(): VendorProfile[] {
    return db.getVendors();
  }

  public static getById(id: string): VendorProfile | undefined {
    return db.getVendorById(id);
  }

  public static create(vendorData: Partial<VendorProfile>): VendorProfile {
    const id = vendorData.id || `v-${Date.now()}`;
    const vendor: VendorProfile = {
      id,
      name: vendorData.name || 'New Enterprise Vendor',
      legalEntity: vendorData.legalEntity || `${vendorData.name} Pvt Ltd`,
      category: vendorData.category || ['General Procurement'],
      country: vendorData.country || 'India',
      headquarters: vendorData.headquarters || 'Bengaluru, India',
      rating: vendorData.rating || 4.5,
      tier: vendorData.tier || 'Certified',
      reliabilityScore: vendorData.reliabilityScore || 90,
      historicalOnTimeDeliveryPct: vendorData.historicalOnTimeDeliveryPct || 92.0,
      historicalDefectRatePct: vendorData.historicalDefectRatePct || 0.5,
      qualityScore: vendorData.qualityScore || 90,
      averagePriceTier: vendorData.averagePriceTier || 'Competitive',
      totalSpendYTD: vendorData.totalSpendYTD || 0,
      completedOrdersCount: vendorData.completedOrdersCount || 0,
      riskLevel: vendorData.riskLevel || 'LOW',
      certifications: vendorData.certifications || ['ISO 9001:2015'],
      contactName: vendorData.contactName || 'Sales Representative',
      contactEmail: vendorData.contactEmail || 'sales@vendor.com',
      contactPhone: vendorData.contactPhone || '+91 80 0000 0000',
      paymentTermsStandard: vendorData.paymentTermsStandard || 'Net 30 Days',
      tags: vendorData.tags || ['Enterprise Supplier'],
      performanceHistory: vendorData.performanceHistory || [],
    };

    return db.createVendor(vendor);
  }

  public static update(id: string, updates: Partial<VendorProfile>): VendorProfile {
    const updated = db.updateVendor(id, updates);
    if (!updated) {
      throw new Error(`Vendor with ID '${id}' not found`);
    }
    return updated;
  }
}
