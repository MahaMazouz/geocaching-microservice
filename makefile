organization ?= MahaMazouz
repository ?= geocaching-microservice
NAME ?= mahamazouz/geocaching-microservice

TAG := $(shell \
	if [ -n "$(GH_TOKEN)" ]; then \
		curl --silent -H "Authorization: token $(GH_TOKEN)" \
		"https://api.github.com/repos/$(organization)/$(repository)/releases" | \
		grep tag_name | head -1 | grep -oP '(?<="tag_name": ").*?(?=")'; \
	fi \
)

ifeq ($(strip $(TAG)),)
TAG := latest
endif

IMG := $(NAME):$(TAG)

deliver_image_to_dockerhub: build cleanup push

retrivetag:
	@echo -n $(TAG)

build:
	@echo "Building image $(IMG)"
	@docker build -t $(IMG) .

cleanup:
	@echo "Cleaning docker cache"
	@docker system prune -f

push:
	@echo "Pushing image $(IMG)"
	@docker push $(IMG)