FROM debian:12.6-slim

ENV EMCEE_CLI_VERSION=0.0.1
ENV EMCE_CLII_ARCHITECTURE=arm64

RUN apt-get update && apt-get -y install bash grep curl

RUN curl --location https://github.com/avito-tech/Emcee.cloud-CLI/releases/download/$EMCEE_CLI_VERSION/emcee-cloud_Linux_$EMCE_CLII_ARCHITECTURE.tar.gz --output emcee-cloud_Linux_$EMCE_CLII_ARCHITECTURE.tar.gz
RUN tar -xzf emcee-cloud_Linux_$EMCE_CLII_ARCHITECTURE.tar.gz -C /usr/bin/
RUN chmod +x /usr/bin/emcee-cloud
RUN emcee-cloud --version

ENTRYPOINT [""]
