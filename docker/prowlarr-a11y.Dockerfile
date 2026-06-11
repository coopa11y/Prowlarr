FROM mcr.microsoft.com/dotnet/runtime-deps:8.0-jammy

ARG PROWLARRVERSION
ARG PROWLARRBRANCH=develop

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates gosu \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /opt/prowlarr

COPY _artifacts/linux-x64/net8.0/Prowlarr/ /opt/prowlarr/
COPY docker/entrypoint.sh /usr/local/bin/prowlarr-entrypoint

RUN chmod +x /usr/local/bin/prowlarr-entrypoint /opt/prowlarr/Prowlarr \
  && find /opt/prowlarr -maxdepth 1 -type f \( -name ffmpeg -o -name ffprobe \) -exec chmod +x {} \; \
  && if [ -n "$PROWLARRVERSION" ]; then printf 'ReleaseVersion=%s\nBranch=%s\n' "$PROWLARRVERSION" "$PROWLARRBRANCH" > /opt/prowlarr/release_info; fi

VOLUME ["/config"]
EXPOSE 9696

ENTRYPOINT ["/usr/local/bin/prowlarr-entrypoint"]
