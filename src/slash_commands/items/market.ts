import marketView from '../../functions/market/market_view';
import marketBuy from '../../functions/market/market_buy';
import marketRemove from '../../functions/market/market_remove';
import marketAdd from '../../functions/market/market_add';
import { SlashCommand } from '../../types';

const market = new SlashCommand()
  .setCommandData(builder =>
    builder
      .setName('market')
      .setDescription('Market commands')
      .addSubcommand(subcommand =>
        subcommand
          .setName('view')
          .setDescription('View the market of a user')
          .addUserOption(option =>
            option
              .setName('user')
              .setDescription('The user whose market to view')
              .setRequired(true)
          )
      )
      .addSubcommand(subcommand =>
        subcommand
          .setName('buy')
          .setDescription("Buy items from a user's market")
          .addUserOption(option =>
            option
              .setName('user')
              .setDescription('The user to buy the item from')
              .setRequired(true)
          )
          .addStringOption(option =>
            option
              .setName('item_name')
              .setDescription('The name of the item you want to buy')
              .setRequired(true)
          )
      )
      .addSubcommand(subcommand =>
        subcommand
          .setName('remove')
          .setDescription('Remove an item from your market')
          .addStringOption(option =>
            option
              .setName('item_name')
              .setDescription(
                'The name of the item you want to remove'
              )
              .setRequired(true)
          )
      )
      .addSubcommand(subcommand =>
        subcommand
          .setName('add')
          .setDescription('Add an item to your market')
          .addStringOption(option =>
            option
              .setName('item_name')
              .setDescription('The name of your item')
              .setRequired(true)
          )
          .addIntegerOption(option =>
            option
              .setName('price')
              .setDescription('The price of the item')
              .setMinValue(1)
              .setMaxValue(10_000)
              .setRequired(true)
          )
          .addStringOption(option =>
            option
              .setName('description')
              .setDescription('A description of your item')
              .setRequired(false)
          )
      )
  )
  .setRun(async interaction => {
    switch (interaction.options.getSubcommand()) {
      case 'view': {
        await marketView(
          interaction,
          interaction.options.getUser('user')
        );
        return;
      }
      case 'buy': {
        await marketBuy(interaction);
        return;
      }
      case 'remove': {
        await marketRemove(interaction);
        return;
      }
      case 'add': {
        await marketAdd(interaction);
        return;
      }
    }
  });

export default market;
