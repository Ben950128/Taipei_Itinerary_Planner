class Config(object):
    TESTING = False
    DEBUG = False

class DevelopmentConfig(Config):
    ENV = "development"
    DEBUG = True
    TEMPLATES_AUTO_RELOAD = True
    JSON_AS_ASCII = False