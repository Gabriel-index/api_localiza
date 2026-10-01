import { Injectable, NotFoundException, BadRequestException, ServiceUnavailableException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class LocalizacaoService {
    // Injeta o HTTPService no nosso service
    constructor(private readonly httpService: HttpService) { }

    // CONSULTAR CEP
    async buscarCEP(cep: string) {
        // Remove qualquer caractere que não seja um número
        // Ex. : 01001-00 se torna 01001000
        const cepLimpo = cep.replace(/\D/g, '');

        if (cepLimpo.length !== 8) {
            throw new BadRequestException('O CEP deve possuir 8 números');
        }
        try {
            const resposta = await lastValueFrom(
                this.httpService.get(`https://viacep.com.br/ws/${cepLimpo}/json/`)
            );
            // O conteudo que vem da API externa fica dentro da propriedade "data"
            const dados = resposta.data;

            // Caso o CEP tenha os 8 números, mas não existia, normalmente o via CEP devolve "erro = true" e nos o tratamos com "not found" =  não encontrado
            if (dados.erro) {
                throw new NotFoundException('CEP não encontrado')
            }
            return {
                cep: dados.cep,
                logradouro: dados.logradouro,
                bairro: dados.bairro,
                cidade: dados.localidade,
                estado: dados.uf,
                regiao: dados.regiao
            }
        } catch (erro) {
            if (erro instanceof NotFoundException || erro instanceof BadRequestException) {
                throw erro;
            }

            throw new ServiceUnavailableException('Não foi possível consultar o serviço de CEP');
        }
    }
    // CONSULTAR LOCALIZAÇÃO POR CIDADE
    async buscarCidade(cidade: string) {
        if (!cidade || cidade.trim().length < 2) {
            throw new BadRequestException('Informe uma cidade válida')
        }
        try {
            const cidadeCodificada = encodeURIComponent(cidade.trim());
            const resposta = await lastValueFrom(this.httpService.get('https://geocoding-api.open-meteo.com/v1/search', {
                params: {
                    name: cidade.trim(),
                    count: 1,
                    language: 'pt',
                    countryCode: 'BR'
                }
            })
            );
            const dados = resposta.data;
            if (!dados.results || dados.results.length == 0) {
                throw new NotFoundException('Localidadade não encontrada');
            }
            const localizacao = dados.results[0];
            return {
                cidade: localizacao.name,
                estado: localizacao.admin1,
                pais: localizacao.country,
                latitude: localizacao.latitude,
                longitude: localizacao.longitude
            }
        } catch (erro) {
            if (erro instanceof NotFoundException || erro instanceof BadRequestException) {
                throw erro;
            }
            throw new ServiceUnavailableException('Não foi possível consultar o serviço de localização')
        }
    }

    // COORDENADAS
    async buscarCepComCoordenadas(cep: string) {
        const endereco = await this.buscarCEP(cep);

        const localizacao = await this.buscarCidade(endereco.cidade);

        return {
            cep: endereco.cep,
            logradouro: endereco.logradouro,
            cidade: endereco.cidade,
            estado: endereco.estado,
            latitude: localizacao.latitude,
            longiude: localizacao.longitude
        }
    }
}



