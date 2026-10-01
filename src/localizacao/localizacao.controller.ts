import { Controller, Get, Param } from '@nestjs/common';
import { LocalizacaoService } from './localizacao.service';

@Controller('localizacao')
export class LocalizacaoController {
    constructor (private readonly localizacaoService:LocalizacaoService){}

    @Get('cep/:cep')
    buscarCEP(@Param('cep') cep:string){
        return this.localizacaoService.buscarCEP(cep)
    }

    @Get('cidade/:cidade')
    buscarCidade(@Param('cidade') cidade:string){
        return this.localizacaoService.buscarCidade(cidade);
    }

    @Get('cep/:cep/coordenadas')
    buscarCepComCoordenadas(@Param('cep') cep:string){
        return this.localizacaoService.buscarCepComCoordenadas(cep);
    }
}
