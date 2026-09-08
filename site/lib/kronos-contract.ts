import registry from './kronos-editions.json';
export const kronosContract = registry.editions['01.3'];
export const digitalDeliveryAcknowledgment = registry.deliveryAcknowledgment;
export type KronosAcceptance = {termsVersion: string; termsAccepted: boolean; immediateDelivery: boolean};
export function validateKronosAcceptance(value: KronosAcceptance): boolean {
  return value.termsVersion === kronosContract.version && value.termsAccepted === true && value.immediateDelivery === true;
}
export function kronosAgreementFields(acceptance: KronosAcceptance, recordedAt = new Date()): Record<string, string> {
  if (!validateKronosAcceptance(acceptance)) throw new Error('The current purchase terms and immediate-delivery request must be accepted');
  return {
    'consent_collection[terms_of_service]': 'required',
    'custom_text[terms_of_service_acceptance][message]': `I agree to the [Kronos Field Guide Purchase Terms, edition ${kronosContract.version}](${kronosContract.termsUrl}). Educational research and paper trading only; no technical support or investment advice.`,
    'metadata[terms_version]': kronosContract.version,
    'metadata[terms_sha256]': kronosContract.termsSha256,
    'metadata[terms_url]': kronosContract.termsUrl,
    'metadata[product_edition]': kronosContract.version,
    'metadata[archive_sha256]': kronosContract.archiveSha256,
    'metadata[refund_policy_version]': kronosContract.refundPolicyVersion,
    'metadata[delivery_request]': 'immediate_acknowledged',
    'metadata[site_assent_recorded_at]': recordedAt.toISOString(),
  };
}
