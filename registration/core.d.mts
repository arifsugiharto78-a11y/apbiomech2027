export const RegistrationCore: {
  choices: Record<string, string[]>;
  limits: Record<string, number>;
  validate(input: Record<string, unknown>, mode: string): {data: Record<string,string>; errors: Record<string,string>; valid: boolean};
  safeCell(value: unknown): string;
  escapeHtml(value: unknown): string;
};
