---
layout: post
title: "O Fim do NGINX Ingress Chega, Mas o Boleto Fica: A Necrose Arquitetural que Custa o Seu Cluster."
subtitle: "Uma Autopsia do Ingress NGINX"
date: 2026-02-21 16:36:00
author: "Frederico Doido"
header-img: autopsia-nginx-ingress.png
tags: [noticias]
---

O código legado é um agiota que não aceita renegociação; ele apenas espera o momento de maior vulnerabilidade para cobrar os juros acumulados em anos de negligência. A decisão do **Kubernetes SIG Network** e do **Security Response Committee** de aposentar o **Ingress NGINX** em março de 2026 é a execução de uma dívida técnica que a indústria tentou ignorar por uma década. Atualmente, aproximadamente 50% dos ambientes de nuvem dependem desse controlador, um Frankenstein de abstrações mantido por um ou dois heróis exaustos em suas horas vagas, enquanto corporações bilionárias tratam sua infraestrutura como um teatro de *Clean Code*. Este relatório disseca o colapso do modelo de “snippets” e a transição obrigatória para o **Gateway API**, onde a realidade do *runtime* finalmente vence o PowerPoint da arquitetura.

`server { listen 443; server_name “fim_da_era”; }`

A infraestrutura de rede do Kubernetes enfrenta sua maior purgação técnica. O anúncio da aposentadoria do **Ingress NGINX** encerra a era da flexibilidade suicida, onde a dependência de anotações de texto permitiu vetores de ataque catastróficos. O **CVE-2025-1974**, com pontuação **CVSS** de *fuckiiing* 9.8, provou que o modelo de “snippets” é um convite para execução remota de código (**RCE**) e sequestro total de segredos do cluster. Economicamente, o impacto é uma **necrose financeira**: o débito técnico ignorado pode reduzir o retorno sobre investimento (**ROI**) de iniciativas de modernização em até 29%, transformando margens de lucro em notas de rodapé de incidentes de segurança.

![]({{ site.baseurl }}/img/cve-2025-1974-impact.png)
*O impacto devastador do IngressNightmare na segurança de clusters.*

`upstream technical_debt { server “seu_legado:666”; }`

A análise de sistemas complexos exige um rigor que ignora a masturbação cerebral das reuniões de diretoria. A premissa é bruta: o código é a verdade única; tudo o que está acima dele é opinião não fundamentada ou marketing mal ensaiado. A metodologia aqui foca na identificação de mecanismos causais em falhas de segurança e na latência como a métrica suprema de valor comercial.

Muitos clusters operam hoje sob o fenômeno da preguiça — promessas de estabilidade que carecem de *throughput* medido ou perfis de latência **P99** reais. Para sanar essa patologia, este relatório confronta o *throughput* de 180.000 requisições por segundo (**RPS**) com o custo real de memória e CPU.

**Provocação para você:** Qual é o impacto real no seu **P99** durante um *reload* massivo de *ConfigMap* quando o cluster ultrapassa os 500 objetos Ingress? Alguém mediu o *jitter* de rede ou o monitoramento é apenas decorativo? A ausência desse dado é o primeiro sintoma de uma engenharia preguiçosa que espera o desastre para agir.

`location ~* .vulnerability$ { deny all; # Tarde demais }`

O **Ingress NGINX** nasceu como um exemplo didático que a preguiça coletiva transformou em padrão de indústria. A especificação original da **Ingress API** era cronicamente anêmica, o que levou ao uso patológico de anotações — pares de chave-valor em strings que funcionam como uma API paralela e obscura. Mais de 75% dos objetos Ingress em uso utilizam pelo menos uma anotação, e 23% utilizam cinco ou mais, criando o que definimos como a “**Armadilha do Templating**”.

O design é fundamentalmente inseguro por depender de:

* **Injeção de Configuração:** O uso de “snippets” permite injeção de diretivas NGINX, transformando o controlador em um interpretador de entradas não confiáveis.
* **Débito Técnico Insuperável:** A flexibilidade que outrora foi um benefício tornou-se um fardo que impossibilita a manutenção segura.
* **Modelo de Reinicialização:** A dependência de regeneração de arquivos e *reload* de processos causa picos de latência em ambientes altamente dinâmicos.

O colapso “**IngressNightmare**” (**CVE-2025-1974**) é o veredito final: o atacante carrega uma biblioteca maliciosa (.so) via um POST grande, injeta a diretiva *ssl_engine* via anotação e, quando o controlador executa `nginx -t` para validar a configuração, o *takeover* do cluster é concluído. Tentar “limpar anotações” agora é como tentar vedar um buraco no submarino com o jubileu após a implosão ter começado.

`proxy_set_header X-Real-Cost $roi;`

A migração para o **Gateway API** não é uma escolha estética; é uma imposição da física econômica. O mercado recompensa a velocidade e pune a latência: cada 100ms de atraso custam 1% em vendas totais.

**Comparativo de Performance (Dados de Fintech - 5.8M req/dia)**

* **NGINX Ingress:** Sustenta até 180.000 **RPS** com latência **P99** de 65ms. No entanto, a depuração de falhas 500 em microserviços complexos é descrita como um “inferno manual”, onde a falta de rastreamento nativo consome horas de engenharia.
* **Istio Gateway:** Apresenta uma queda inicial de 25% no *throughput* e latência **P99** de 95ms. Em contrapartida, reduz incidentes de implantação em 80% e corta o tempo de *troubleshooting* de horas para minutos.
* **Cilium eBPF:** Utiliza o *kernel* para contornar o processamento tradicional. Atinge latência **P99** de 0,8ms, um ganho de 33% sobre o **Calico** (1,2ms) e mais de 50% sobre o **Flannel** (1,8ms).

**Provocação Técnica:** Qual é o *overhead* real de CPU do seu plano de dados **Envoy** quando o **mTLS** está em modo ‘strict’ sob uma carga de 500k conexões simultâneas? Alguém no seu time sabe explicar o gráfico de consumo de memória ou o dimensionamento é baseado em “sentimento”?

O débito técnico acumulado em redes legadas consome até 29% dos orçamentos de IA. Se a base da sua infraestrutura é uma necrose de anotações, sua iniciativa de IA é apenas uma forma cara de automatizar a geração de erros.

`return 410 “Gone”; # O Veredito Operacional`

Meu povo, o diagnóstico é de morte encefálica arquitetural. O **Ingress NGINX** parou de ser um ativo para se tornar uma responsabilidade civil e técnica que expõe sua organização ao “**IngressNightmare**”. Manter esse Frankenstein após março de 2026 é um convite formal para que qualquer ator de ameaça sequestre seus segredos de produção.

**Implicações Operacionais Imediatas:**

1.  **Auditoria de Existência:** utilize `kubectl get pods -A -l app.kubernetes.io/name=ingress-nginx` para localizar os focos de infecção.
2.  **Inventário de “Snippets”:** Utilize de suas tarefas do *backlog* para auditar a complexidade das anotações que você jurou que removeria “no próximo sprint”.

**Escolha do Sucessor:**

* **Cilium:** Para quem busca performance de *kernel* (**P99** de 0,8ms) e visibilidade via **eBPF**.
* **Istio/Envoy:** Para quem precisa de governança e **mTLS** automatizado, aceitando o custo de CPU em favor da sanidade operacional.
* **NGINX Gateway Fabric:** Destinado a quem mantém um apego emocional irracional ao engine NGINX, mas, ainda assim, reconhece a necessidade de aderir à especificação **Gateway API**. (Confesso: nem estava ciente de sua existência até pesquisar para este artigo.)

O débito vence em março de 2026. Você pode pagar agora com uma migração estruturada ou pagar depois com o seu cargo após a próxima violação de dados. O código parou de negociar; a física do *runtime* não se importa com seu cronograma de feriados.

---

### Referências de Trincheira:

* Ingress NGINX: Statement from the Kubernetes Steering and Security Response Committees: https://kubernetes.io/blog/2026/01/29/ingress-nginx-statement/
* CVE-2025-1974: Critical Set of Vulnerabilities in Ingress NGINX: https://socprime.com/blog/cve-2025-1974-aka-ingress-nightmare/
* IngressNightmare: Unauth RCE in Ingress NGINX (CVE-2025-1974): https://projectdiscovery.io/blog/ingressnightmare-unauth-rce-in-ingress-nginx
* Why the Ingress NGINX Fork is Not a Security Strategy - Traefik Labs: https://traefik.io/blog/the-illusion-of-safety-why-the-ingress-nginx-fork-is-not-a-security-strategy
* Kubernetes CNI 2025: Cilium vs Calico vs Flannel Performance: https://sanj.dev/post/cilium-calico-flannel-cni-performance-comparison
* A practical approach to boosting your AI ROI - IBM: https://www.ibm.com/thought-leadership/institute-business-value/en-us/report/technical-debt-ai-roi
