export function getNextLevelID(currentLevelID: string): string {
  const match = currentLevelID.match(/(level)(\d+)/); // Captura 'level' y el número
  if (!match) {
    throw new Error(`Invalid level ID format: ${currentLevelID}`);
  }

  const prefix = match[1]; // 'level'
  const currentNumber = parseInt(match[2], 10); // Número actual
  const nextNumber = currentNumber + 1; // Incrementa el número
  const nextLevelID = `${prefix}${nextNumber.toString().padStart(2, '0')}`; // Formatea con ceros a la izquierda

  return nextLevelID;
}
