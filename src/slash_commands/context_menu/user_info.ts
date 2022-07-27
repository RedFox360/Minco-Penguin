import memberInfo from '../../functions/info/member_info';
import { UserContextMenu } from '../../types';

const userInfo = new UserContextMenu()
	.setCommandData(builder => builder.setName('User info'))
	.setRun(interaction =>
		memberInfo(interaction, interaction.targetMember)
	);

export default userInfo;
