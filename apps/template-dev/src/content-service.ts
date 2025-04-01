export interface ProductService {
  getContent(...args: unknown[]): Promise<string>
}

type Product = "car" | "van" | "bike" | "pet" | "home" | "loans" | "creditcards"

export class CoreProductContentService implements ProductService {
  async getContent(): Promise<string> {
    return "Content from core products source"
  }
}

export class MoneyProductContentService implements ProductService {
  async getContent(): Promise<string> {
    return "Content from money products source"
  }
}

export class ContentService {
  private static readonly productFactories: Record<
    Product,
    () => ProductService
  > = {
    car: () => new CoreProductContentService(),
    van: () => new CoreProductContentService(),
    bike: () => new CoreProductContentService(),
    pet: () => new CoreProductContentService(),
    home: () => new CoreProductContentService(),
    loans: () => new MoneyProductContentService(),
    creditcards: () => new MoneyProductContentService(),
  }

  static isValidProduct(product: Product): product is Product {
    return product in this.productFactories
  }

  static create(product: Product): ProductService {
    if (!this.isValidProduct(product)) {
      throw new Error(`Invalid product: ${product}`)
    }

    return this.productFactories[product]()
  }
}

const contentService = ContentService.create("car")
const content = await contentService.getContent()
console.log("content", content)
