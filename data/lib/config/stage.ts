import { Config } from './config.type';

export const determineStage = (lifecycleEvent: string | undefined, nodeEnv: string | undefined): Config['stage'] => {
	if (!lifecycleEvent && !nodeEnv) {
		throw Error(`lifecycle and node env is not defined`);
	}
	switch (true) {
		case lifecycleEvent?.startsWith('test'):
			return 'test';
		case lifecycleEvent?.startsWith('start'):
			return lifecycleEvent?.endsWith(':dev') ? 'dev' : 'prod';
		case lifecycleEvent?.startsWith('schema'):
			return 'stage';
		case nodeEnv === 'test':
			return 'test';
		case nodeEnv === 'staging':
			return 'stage';
		case nodeEnv === 'development':
			return 'dev';
		case nodeEnv === 'production':
			return 'prod';
		default:
			throw Error(`unknown lifecycle '${lifecycleEvent}' and node env '${nodeEnv}'`);
	}
};
