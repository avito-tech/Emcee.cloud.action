FROM avitotech/emcee-cloud-cli:0.0.2

COPY action_entrypoint.sh /action_entrypoint.sh
RUN chmod 0755 /action_entrypoint.sh

ENTRYPOINT ["/action_entrypoint.sh"]
