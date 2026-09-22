import { phones, type Phone } from "@/content/products/phones";

export interface PhoneRepository {
  list(): Promise<readonly Phone[]>;
  findBySlug(slug: string): Promise<Phone | null>;
}

class LocalPhoneRepository implements PhoneRepository {
  async list() { return phones; }
  async findBySlug(slug: string) { return phones.find((phone) => phone.slug === slug) ?? null; }
}

export const phoneRepository: PhoneRepository = new LocalPhoneRepository();
