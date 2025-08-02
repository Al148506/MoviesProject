export function extractErrors(obj: any): string[] {
  const err = obj.error.errors;
  let errorMessages: string[] = [];
  for (let key in err) {
    let field = key;
    const messagesWithFields = err[key].map(
      (message: string) => `${field}: ${message}`
    );
    errorMessages = errorMessages.concat(messagesWithFields);
  }

  return errorMessages;
}

export function extractErrorsIdentity(obj: any): string[] {
  let errorMessages: string[] = [];
  for (let i = 0; i < obj.error.length; i++) {
    const element = obj.error[i];
    errorMessages.push(element.description);
    
  }
  return errorMessages;
}
