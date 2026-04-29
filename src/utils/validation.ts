// Validation utilities for admission forms
// Supports Egyptian National ID and International Passport validation

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

// Egyptian Governorates codes (01-27)
const EGYPTIAN_GOVERNORATES: Record<string, string> = {
  '01': 'Cairo', '02': 'Alexandria', '03': 'Port Said', '04': 'Suez',
  '11': 'Damietta', '12': 'Dakahlia', '13': 'Sharqia', '14': 'Qalyubia',
  '15': 'Kafr el-Sheikh', '16': 'Gharbia', '17': 'Monufia', '18': 'Beheira',
  '19': 'Ismailia', '21': 'Giza', '22': 'Beni Suef', '23': 'Faiyum',
  '24': 'Minya', '25': 'Asyut', '26': 'Sohag', '27': 'Qena',
  '28': 'Aswan', '29': 'Luxor', '31': 'Red Sea', '32': 'New Valley',
  '33': 'Matruh', '34': 'North Sinai', '35': 'South Sinai', '88': 'Outside Egypt'
};

/**
 * Validate Egyptian National ID (14 digits)
 * Format: CYYMMDDSSIIIC
 * C = Century (2 for 1900s, 3 for 2000s)
 * YY = Year
 * MM = Month
 * DD = Day
 * SS = Governorate (01-27, or 88 for abroad)
 * III = Serial number
 * C = Check digit
 */
export const validateEgyptianNationalId = (id: string): ValidationResult => {
  // Check if empty
  if (!id || id.trim() === '') {
    return { valid: false, error: 'nationalId.required' };
  }

  // Check 14 digits only
  if (!/^\d{14}$/.test(id)) {
    return { valid: false, error: 'nationalId.length' };
  }

  // Extract components
  const century = id[0];
  const year = id.substring(1, 3);
  const month = id.substring(3, 5);
  const day = id.substring(5, 7);
  const governorate = id.substring(7, 9);

  // Validate century (2 or 3)
  if (century !== '2' && century !== '3') {
    return { valid: false, error: 'nationalId.century' };
  }

  // Validate month (01-12)
  const monthNum = parseInt(month);
  if (monthNum < 1 || monthNum > 12) {
    return { valid: false, error: 'nationalId.date' };
  }

  // Validate day (01-31 depending on month)
  const dayNum = parseInt(day);
  const daysInMonth = new Date(parseInt(century === '2' ? '19' : '20' + year), monthNum, 0).getDate();
  if (dayNum < 1 || dayNum > daysInMonth) {
    return { valid: false, error: 'nationalId.date' };
  }

  // Validate governorate (01-35 or 88 for abroad)
  const govCode = parseInt(governorate);
  if ((govCode < 1 || govCode > 35) && govCode !== 88) {
    return { valid: false, error: 'nationalId.governorate' };
  }

  return { valid: true };
};

/**
 * Validate International Passport Number
 * Supports various formats: AB123456, 123456789, A12345678, etc.
 */
export const validatePassport = (passport: string): ValidationResult => {
  // Check if empty
  if (!passport || passport.trim() === '') {
    return { valid: false, error: 'passport.required' };
  }

  // Remove spaces and convert to uppercase
  const cleaned = passport.trim().toUpperCase().replace(/\s/g, '');

  // Common passport formats:
  // - 2 letters + 6-7 digits (most countries)
  // - 1 letter + 8 digits
  // - 6-9 digits only (some countries)
  // - Mixed alphanumeric (9-12 chars)
  
  const validPatterns = [
    /^[A-Z]{2}\d{6,9}$/,        // AB123456 or AB123456789
    /^[A-Z]\d{8}$/,             // A12345678
    /^\d{6,9}$/,                // 123456789
    /^[A-Z0-9]{6,12}$/,         // Alphanumeric 6-12 chars
  ];

  const isValid = validPatterns.some(pattern => pattern.test(cleaned));
  
  if (!isValid) {
    return { valid: false, error: 'passport.format' };
  }

  return { valid: true };
};

/**
 * Validate that at least one ID is provided (National ID or Passport)
 */
export const validateIdRequirement = (
  nationalId: string,
  passport: string
): ValidationResult => {
  const hasNationalId = nationalId && nationalId.trim() !== '';
  const hasPassport = passport && passport.trim() !== '';

  if (!hasNationalId && !hasPassport) {
    return { valid: false, error: 'id.required' };
  }

  // If national ID is provided, validate it
  if (hasNationalId) {
    const nationalIdValidation = validateEgyptianNationalId(nationalId);
    if (!nationalIdValidation.valid) {
      return nationalIdValidation;
    }
  }

  // If passport is provided, validate it
  if (hasPassport) {
    const passportValidation = validatePassport(passport);
    if (!passportValidation.valid) {
      return passportValidation;
    }
  }

  return { valid: true };
};

/**
 * Validate required documents
 */
export const validateDocuments = (documents: File[]): ValidationResult => {
  if (!documents || documents.length === 0) {
    return { valid: false, error: 'documents.required' };
  }
  return { valid: true };
};

/**
 * Validation messages in both languages
 */
export const validationMessages = {
  ar: {
    'nationalId.required': 'الرقم القومي مطلوب إذا لم يتم إدخال رقم جواز السفر',
    'nationalId.length': 'الرقم القومي يجب أن يكون 14 رقمًا',
    'nationalId.century': 'الرقم القومي يجب أن يبدأ بـ 2 أو 3',
    'nationalId.date': 'الرقم القومي غير صالح - تاريخ الميلاد غير صحيح',
    'nationalId.governorate': 'الرقم القومي غير صالح - محافظة غير معروفة',
    'passport.required': 'رقم جواز السفر مطلوب إذا لم يتم إدخال الرقم القومي',
    'passport.format': 'رقم جواز السفر غير صالح',
    'id.required': 'يجب إدخال الرقم القومي أو رقم جواز السفر',
    'documents.required': 'يجب إرفاق جميع المستندات المطلوبة',
  },
  en: {
    'nationalId.required': 'National ID is required if passport is not provided',
    'nationalId.length': 'National ID must be exactly 14 digits',
    'nationalId.century': 'National ID must start with 2 or 3',
    'nationalId.date': 'Invalid national ID - invalid birth date',
    'nationalId.governorate': 'Invalid national ID - unknown governorate',
    'passport.required': 'Passport number is required if national ID is not provided',
    'passport.format': 'Invalid passport number format',
    'id.required': 'Please enter either national ID or passport number',
    'documents.required': 'All required documents must be attached',
  }
};

/**
 * Get validation message based on language
 */
export const getValidationMessage = (errorKey: string, language: 'ar' | 'en' = 'ar'): string => {
  return validationMessages[language][errorKey as keyof typeof validationMessages.ar] || errorKey;
};
