import {
  ScraperEstateReqDTO,
  ScraperEstateResDTO,
} from '@/application/dto/scraper.dto'
import {
  ScraperEstate,
  ScrappingEstateRequest,
} from '@/domain/entities/scraper'

export class ScraperMapper {
  static scraperReqDtoToDomain(
    req: ScraperEstateReqDTO
  ): ScrappingEstateRequest {
    return {
      maxPage: req.max_page,
      startPage: req.start_page,
      targetUrl: req.target_url,
    }
  }

  static scraperReqDomainToDto(
    req: ScrappingEstateRequest
  ): ScraperEstateReqDTO {
    return {
      max_page: req.maxPage,
      start_page: req.startPage,
      target_url: req.targetUrl,
    }
  }

  static scraperResDtoToDomain(req: ScraperEstateResDTO): ScraperEstate {
    return {
      message: req.message,
    }
  }
}
