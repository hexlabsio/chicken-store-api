
export const chickenTypes = [ 'Plymouth Rock', 'Barnevelder', 'Australorp', 'Orpington', 'Silkie', 'Frizzle'] as const;

export type ChickenCreateRequest = Omit<Chicken, 'identifier'>

export interface Chicken {
  identifier: string;
  name: string;
  type: (typeof chickenTypes)[number];
}
