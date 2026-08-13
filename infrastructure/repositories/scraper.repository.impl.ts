import {
  ScraperEstateReqDTO,
  ScraperEstateResDTO,
} from '@/application/dto/scraper.dto'
import { IScraperRepository } from '@/domain/repositories/scraper.repository'
import { axiosClient } from '../api/axios_client'

export class ScraperRepositoryImpl implements IScraperRepository {
  async scraperEstate(req: ScraperEstateReqDTO): Promise<ScraperEstateResDTO> {
    const response = await axiosClient.post<ScraperEstateResDTO>(
      '/scraper/rental-estate',
      {
        max_page: req.max_page,
        start_page: req.start_page,
        target_url: req.target_url,
      },
      {
        timeout: 0,
      }
    )
    return response.data
  }
}
