import { router } from 'lib/router';
import { findConnections, streamData } from './f1.service';

const app = router('/f1');

app.get('/sse', null, ({ req }) => {
	return streamData(req);
});

app.get('/connections', null, () => {
	return findConnections();
});
