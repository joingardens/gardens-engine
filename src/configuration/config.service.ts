import Joi = require('joi')

const DEFAULT_PASSWORD = 'captain42'
export const LOGIN_MODE_DICTIONARY = {
    NATIVE: 'NATIVE',
    KEYCLOAK: 'KEYCLOAK',
} as const

export type EnvType = typeof configSchema

export const configSchema = {
    NODE_ENV: Joi.string()
        .valid('production', 'development', 'test')
        .required(),
    LOGIN_MODE: Joi.string()
        .valid(...Object.values(LOGIN_MODE_DICTIONARY))
        .required(),
    BY_PASS_PROXY_CHECK: Joi.string().default('FALSE').valid('TRUE', 'FALSE'),
    CAPTAIN_DOCKER_API: Joi.string(),
    CAPTAIN_IS_DEBUG: Joi.string().valid(0, 1).default(0),
    MAIN_NODE_IP_ADDRESS: Joi.string(),
    IS_CAPTAIN_INSTANCE: Joi.string().valid(0, 1).default(0),
    DEMO_MODE_ADMIN_IP: Joi.string(),
    DEFAULT_PASSWORD: Joi.string().default(DEFAULT_PASSWORD),
}

export const envVarsSchema = Joi.object(configSchema)

export class ConfigService {
    private _config: EnvType
    constructor() {
        let envConfig = {
            ...process.env,
        }
        const { value: envVars, error } = envVarsSchema.validate(envConfig, {
            abortEarly: false,
            allowUnknown: true,
        })
        if (error) {
            throw error
        }
        this._config = envVars
    }

    get(key: keyof EnvType) {
        return this._config[key]
    }

    get _configuration() {
        return this._config
    }
}

export const _configService = new ConfigService()
