import {
  ScraperEstate,
  ScrappingEstateRequest,
} from '@/domain/entities/scraper'
import { IScraperRepository } from '@/domain/repositories/scraper.repository'
import { ScraperMapper } from '@/infrastructure/mappers/scraper.mapper'

export class ScrappingEstateUsecase {
  constructor(private repository: IScraperRepository) {}

  async execute(req: ScrappingEstateRequest): Promise<ScraperEstate> {
    const dto = ScraperMapper.scraperReqDomainToDto(req)
    const res = await this.repository.scraperEstate(dto)
    return ScraperMapper.scraperResDtoToDomain(res)
  }
}
