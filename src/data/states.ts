// ========================================
// US States — For Sign Up Dropdown
// ========================================
// Each state maps to its audit jurisdiction

export interface USState {
    code: string;
    name: string;
    auditAuthority: string; // Primary compliance body
}

export const US_STATES: USState[] = [
    { code: 'AL', name: 'Alabama', auditAuthority: 'Alabama Dept. of Public Health' },
    { code: 'AK', name: 'Alaska', auditAuthority: 'Alaska Dept. of Environmental Conservation' },
    { code: 'AZ', name: 'Arizona', auditAuthority: 'Arizona Dept. of Health Services' },
    { code: 'AR', name: 'Arkansas', auditAuthority: 'Arkansas Dept. of Health' },
    { code: 'CA', name: 'California', auditAuthority: 'California Dept. of Public Health' },
    { code: 'CO', name: 'Colorado', auditAuthority: 'Colorado Dept. of Public Health & Environment' },
    { code: 'CT', name: 'Connecticut', auditAuthority: 'Connecticut Dept. of Public Health' },
    { code: 'DE', name: 'Delaware', auditAuthority: 'Delaware Division of Public Health' },
    { code: 'FL', name: 'Florida', auditAuthority: 'Florida Dept. of Business & Professional Regulation' },
    { code: 'GA', name: 'Georgia', auditAuthority: 'Georgia Dept. of Public Health' },
    { code: 'HI', name: 'Hawaii', auditAuthority: 'Hawaii Dept. of Health' },
    { code: 'ID', name: 'Idaho', auditAuthority: 'Idaho Dept. of Health & Welfare' },
    { code: 'IL', name: 'Illinois', auditAuthority: 'Illinois Dept. of Public Health' },
    { code: 'IN', name: 'Indiana', auditAuthority: 'Indiana State Dept. of Health' },
    { code: 'IA', name: 'Iowa', auditAuthority: 'Iowa Dept. of Inspections & Appeals' },
    { code: 'KS', name: 'Kansas', auditAuthority: 'Kansas Dept. of Agriculture' },
    { code: 'KY', name: 'Kentucky', auditAuthority: 'Kentucky Cabinet for Health & Family Services' },
    { code: 'LA', name: 'Louisiana', auditAuthority: 'Louisiana Dept. of Health — OPH' },
    { code: 'ME', name: 'Maine', auditAuthority: 'Maine Dept. of Health & Human Services' },
    { code: 'MD', name: 'Maryland', auditAuthority: 'Maryland Dept. of Health' },
    { code: 'MA', name: 'Massachusetts', auditAuthority: 'Massachusetts Dept. of Public Health' },
    { code: 'MI', name: 'Michigan', auditAuthority: 'Michigan Dept. of Agriculture & Rural Development' },
    { code: 'MN', name: 'Minnesota', auditAuthority: 'Minnesota Dept. of Health' },
    { code: 'MS', name: 'Mississippi', auditAuthority: 'Mississippi State Dept. of Health' },
    { code: 'MO', name: 'Missouri', auditAuthority: 'Missouri Dept. of Health & Senior Services' },
    { code: 'MT', name: 'Montana', auditAuthority: 'Montana Dept. of Public Health & Human Services' },
    { code: 'NE', name: 'Nebraska', auditAuthority: 'Nebraska Dept. of Agriculture' },
    { code: 'NV', name: 'Nevada', auditAuthority: 'Southern Nevada Health District / Washoe County' },
    { code: 'NH', name: 'New Hampshire', auditAuthority: 'New Hampshire Dept. of Health & Human Services' },
    { code: 'NJ', name: 'New Jersey', auditAuthority: 'New Jersey Dept. of Health' },
    { code: 'NM', name: 'New Mexico', auditAuthority: 'New Mexico Environment Dept.' },
    { code: 'NY', name: 'New York', auditAuthority: 'New York State Dept. of Health' },
    { code: 'NC', name: 'North Carolina', auditAuthority: 'North Carolina Dept. of Health & Human Services' },
    { code: 'ND', name: 'North Dakota', auditAuthority: 'North Dakota Dept. of Health' },
    { code: 'OH', name: 'Ohio', auditAuthority: 'Ohio Dept. of Health' },
    { code: 'OK', name: 'Oklahoma', auditAuthority: 'Oklahoma State Dept. of Health' },
    { code: 'OR', name: 'Oregon', auditAuthority: 'Oregon Health Authority' },
    { code: 'PA', name: 'Pennsylvania', auditAuthority: 'Pennsylvania Dept. of Agriculture' },
    { code: 'RI', name: 'Rhode Island', auditAuthority: 'Rhode Island Dept. of Health' },
    { code: 'SC', name: 'South Carolina', auditAuthority: 'South Carolina DHEC' },
    { code: 'SD', name: 'South Dakota', auditAuthority: 'South Dakota Dept. of Health' },
    { code: 'TN', name: 'Tennessee', auditAuthority: 'Tennessee Dept. of Health' },
    { code: 'TX', name: 'Texas', auditAuthority: 'Texas Dept. of State Health Services' },
    { code: 'UT', name: 'Utah', auditAuthority: 'Utah Dept. of Health & Human Services' },
    { code: 'VT', name: 'Vermont', auditAuthority: 'Vermont Dept. of Health' },
    { code: 'VA', name: 'Virginia', auditAuthority: 'Virginia Dept. of Health' },
    { code: 'WA', name: 'Washington', auditAuthority: 'Washington State Dept. of Health' },
    { code: 'WV', name: 'West Virginia', auditAuthority: 'West Virginia DHHR' },
    { code: 'WI', name: 'Wisconsin', auditAuthority: 'Wisconsin Dept. of Agriculture, Trade & Consumer Protection' },
    { code: 'WY', name: 'Wyoming', auditAuthority: 'Wyoming Dept. of Agriculture' },
    { code: 'DC', name: 'Washington D.C.', auditAuthority: 'DC Dept. of Health' },
    { code: 'PR', name: 'Puerto Rico', auditAuthority: 'Puerto Rico Dept. of Health' },
];

export const VENUE_TYPES = [
    { value: 'bar', label: 'Bar / Lounge' },
    { value: 'restaurant', label: 'Restaurant' },
    { value: 'nightclub', label: 'Nightclub' },
    { value: 'hotel', label: 'Hotel / Resort' },
    { value: 'brewery', label: 'Brewery / Taproom' },
    { value: 'food_truck', label: 'Food Truck' },
    { value: 'catering', label: 'Catering Company' },
    { value: 'cafe', label: 'Café / Coffee Shop' },
    { value: 'other', label: 'Other' },
];

export const EMPLOYEE_RANGES = [
    { value: '1-10', label: '1–10 employees' },
    { value: '10-30', label: '10–30 employees' },
    { value: '30-50', label: '30–50 employees' },
    { value: '50+', label: '50+ employees' },
];
