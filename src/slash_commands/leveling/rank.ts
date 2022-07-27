import { getProfileInServer } from '../../functions/models';
import { levelXpArr } from '../../functions/xp_to_level';
import { SlashCommand } from '../../types';
import { request } from 'undici';
import Canvas from '@napi-rs/canvas';
import { AttachmentBuilder } from 'discord.js';

const rank = new SlashCommand()
	.setCommandData(builder =>
		builder
			.setName('rank')
			.setDescription('View your level and xp!')
			.addUserOption(option =>
				option
					.setName('user')
					.setDescription('The user to view the rank of')
					.setRequired(false)
			)
	)
	.setRun(async interaction => {
		const member =
			interaction.options.getMember('user') ?? interaction.member;
		const { level, xp } = await getProfileInServer(
			member.id,
			interaction.guildId
		);
		const canvas = Canvas.createCanvas(700, 250);
		const ctx = canvas.getContext('2d');
		const { body } = await request(
			interaction.user.displayAvatarURL({ extension: 'jpg' })
		);
		const avatar = new Canvas.Image();
		avatar.src = Buffer.from(await body.arrayBuffer());
		ctx.fillStyle = '#36393F';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = '#2F3136';
		roundRect(
			ctx,
			230,
			20,
			canvas.width - 250,
			canvas.height - 40,
			10
		);
		ctx.fillStyle = '#FFFFFF';
		const text = member.user.tag;
		ctx.font = applyText(canvas, text);
		ctx.fillText(text, canvas.width / 2.5, canvas.height / 1.5);
		ctx.drawImage(avatar, 0, 0, 200, canvas.height);
		ctx.font = '45px sans-serif';
		ctx.fillStyle = '#D2B4DE';
		ctx.fillText(
			`Level ${level}`,
			canvas.width / 2.5,
			canvas.height / 2.1
		);
		ctx.fillStyle = '#BB8FCE';
		ctx.font = '35px sans-serif';
		ctx.fillText(
			`${xp} / ${levelXpArr[level]} XP`,
			canvas.width / 1.6,
			canvas.height / 2.1
		);
		const attachment = new AttachmentBuilder(
			canvas.toBuffer('image/png')
		);

		interaction.reply({ files: [attachment] });
	});

function roundRect(
	ctx: Canvas.SKRSContext2D,
	x: number,
	y: number,
	width: number,
	height: number,
	eRadius = 5,
	fill = true,
	stroke = false
) {
	const radius = {
		tl: eRadius,
		tr: eRadius,
		br: eRadius,
		bl: eRadius
	};
	ctx.beginPath();
	ctx.moveTo(x + radius.tl, y);
	ctx.lineTo(x + width - radius.tr, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
	ctx.lineTo(x + width, y + height - radius.br);
	ctx.quadraticCurveTo(
		x + width,
		y + height,
		x + width - radius.br,
		y + height
	);
	ctx.lineTo(x + radius.bl, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
	ctx.lineTo(x, y + radius.tl);
	ctx.quadraticCurveTo(x, y, x + radius.tl, y);
	ctx.closePath();
	if (fill) {
		ctx.fill();
	}
	if (stroke) {
		ctx.stroke();
	}
}

function applyText(canvas: Canvas.Canvas, text: string) {
	const context = canvas.getContext('2d');
	let fontSize = 40;
	do {
		context.font = `${(fontSize -= 5)}px sans-serif`;
	} while (context.measureText(text).width > canvas.width - 300 - 50);
	return context.font;
}

export default rank;
