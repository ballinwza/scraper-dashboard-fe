import {
  ScraperEstateReqDTO,
  ScraperEstateResDTO,
} from '@/application/dto/scraper.dto'

export interface IScraperRepository {
  scraperEstate(req: ScraperEstateReqDTO): Promise<ScraperEstateResDTO>
}
