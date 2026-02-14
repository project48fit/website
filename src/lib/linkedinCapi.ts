import crypto from 'crypto';

type LinkedInConversionResult = {
  sent: boolean;
  status?: number;
  body?: string;
  reason?: string;
};

type SendLinkedInApplyConversionInput = {
  email?: string;
  li_fat_id?: string;
  eventId?: string;
};

// Requires LINKEDIN_ACCESS_TOKEN and LINKEDIN_CONVERSION_URN on the server.
export async function sendLinkedInApplyConversion(
  input: SendLinkedInApplyConversionInput
): Promise<LinkedInConversionResult> {
  const accessToken = process.env.LINKEDIN_ACCESS_TOKEN;
  const conversionUrn = process.env.LINKEDIN_CONVERSION_URN;

  if (!accessToken || !conversionUrn) {
    return { sent: false, reason: 'missing_env' };
  }

  const userIds: Array<{ idType: string; idValue: string }> = [];

  if (input.li_fat_id) {
    userIds.push({
      idType: 'LINKEDIN_FIRST_PARTY_ADS_TRACKING_UUID',
      idValue: input.li_fat_id
    });
  }

  if (input.email) {
    const normalizedEmail = input.email.trim().toLowerCase();
    if (normalizedEmail) {
      const sha256Hex = crypto.createHash('sha256').update(normalizedEmail).digest('hex');
      userIds.push({
        idType: 'SHA256_EMAIL',
        idValue: sha256Hex
      });
    }
  }

  if (userIds.length === 0) {
    return { sent: false, reason: 'no_user_ids' };
  }

  const payload = {
    conversion: conversionUrn,
    conversionHappenedAt: Date.now(),
    eventId: input.eventId ?? crypto.randomUUID(),
    user: { userIds }
  };

  try {
    const response = await fetch('https://api.linkedin.com/rest/conversionEvents', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
        'Linkedin-Version': '202601'
      },
      body: JSON.stringify(payload)
    });

    const body = await response.text();
    return { sent: response.ok, status: response.status, body };
  } catch (error) {
    return { sent: false, reason: error instanceof Error ? error.message : 'unknown_error' };
  }
}
