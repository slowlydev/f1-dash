import { router } from 'lib/router';
import { findNextMeeting } from './meeting.service';

const app = router('next-meeting');

app.get('', null, () => {
	return findNextMeeting();
});
