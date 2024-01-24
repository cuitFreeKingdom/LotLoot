#  LotLoot

LootLot is a parking spot pvp chain tour launched by the FreeKingdom team, a new gameplay of the classic game. Based on the latest Ethereum protocol innovation, with the game between players as the core to provide highly playable on-chain gameplay, where you can invite your Twitter friends to enter the game together, in order to get game rewards and interact with each other, promote the development of the game ecosystem, based on the wrap protocol equipment decomposition system can also let players quickly leave the field.

# key feature

## function Introduction

1. park

   Robbing a parking space is the core gameplay of the game. Players can get revenue over time after parking their vehicles in the parking space. The types of revenue include our game tokens. It should be noted that after parking their cars in the parking space of the parking space owner, the parking space owner will also get certain revenue (please refer to the game section for details).

2. ticket

   When the player finds that his parking space is seized by a friend, he can slap a ticket on his friend, and after the ticket is affixed, he can get a portion of the friend's parking revenue and empty the parking space. The amount of the ticket depends on how long the vehicle has been sitting and the license plate rating, with the higher the license plate rating, the greater the degree of impunity.

3. Component purchase

   or our initial users, we will cast a car without any accessories for free, the car will get a certain minimum income when parking, if you want to speed up the income, you need to invest more energy or upgrade the components, users can purchase different attributes and different levels of equipment according to their needs, to meet the needs of players in the game. Component purchases cost in-game tokens, and the pricing function is similar to the pricing function of component decomposition (component decomposition also takes into account component wear values), the specific equipment details are as follows

   > car body

   - The maximum amount of time a user's vehicle can continue to earn money in a friend's spot.

   - Depending on the class of body components of the vehicle, the initial duration is 2h, which can be increased to 3h, 5h, 10h after upgrading.

     

   > wheel

   - The rate at which the user's vehicle generates revenue on the parking space.
   - Depending on the wheel assembly class of the vehicle, the initial speed is 1/h, which can be increased to 3/h, 5/h, and 8/h after upgrading.

   > plate

   - The amount of revenue deduction deducted after the user's vehicle is ticketed while parking in a friend's space.
   - Depending on the license plate component level of the vehicle, the initial reduction amount is 0, which can be increased to 20, 30, and 50 after upgrading.

4. Component mounting

   The vehicle can only be mounted with one component at the same position at the same time, such as level 1 wheels, level 2 body, and level 3 license plate configuration, and the vehicle is subject to the corresponding premium after mounting.

5. Component decomposition

   For the equipment in the game, we provide a decomposition channel, which is priced by writing the pricing function of the blockchain, and the pricing function is related to the total circulation of the equipment and the equipment wear value (refer to the equipment wear value plate for specific content).

6. Address book

   The address book stores some of your friends' on-chain addresses, and you can quickly reach your friends' parking lot through the address book (the address book can also be searched from Twitter friends or from the search box).

7. attrition value

   When the component is mounted on the vehicle by the player and goes to the friend's parking space to seize the parking space, the accumulation of revenue will also bring wear to the component, the player can mount the worn component on the car and park in their own parking space to repair, but it should be noted that the repair component needs to consume the electricity of the parking space (please refer to the parking space electricity plate).

8. Parking space electricity

   Parking space power requires friends to park in the player's parking space and replenish it over time, if you want your parking space to have enough power, then invite your Twitter friends to participate in the game!



## Gameplay introduction

Each player has 5 parking Spaces, parking space can park their own car, can also be seized by friends, when the vehicle is parked in the parking space, the vehicle can change with time and gain revenue (LLT token), income speed and wheel level is proportional to the maximum income time determined by the body level, when their parking space is seized by friends, you can attach a ticket to it, The proportion of the proceeds is determined by the level of the friend's license plate. The high level license plate will resist the strength of the fine, but don't worry, your friend will not park wirelessly in your spot, because the components of the vehicle (tires, body, license plate) will also cause wear and tear while helping your friend gain revenue. Recovery of component wear is performed only when the vehicle carrying the component is parked in its own parking space. The repair process consumes the parking space's power, which can only be restored if the space is parked by a friend.

## game

> To be or not to be, that's a question.

Game as the core gameplay, on the basis of the traditional parking space grab, we introduce the concept of wear and power, parking Spaces, cars and components as user assets, different components and car combinations, parking in their own/friends' parking Spaces at different times will bring different revenue effects, because friends parking in their own parking Spaces will charge their own parking. So the occupied parking space is not necessarily a bad thing, the game is an eternal topic in our game,

```
Scenario 1: Your parking space is tight, you need to park your vehicle in your parking space, repair the durability of the parts and then sell it.

Scenario 2: The friend's car has reached the maximum parking time, and vacate the parking space after Posting the ticket.

Scenario 3: When the vehicle with a higher license plate grade is parked, the ticket is posted early to allow other vehicles to park and increase revenue.
....
```

## economics

### asset

electricity value of parking Spaces and the wear value of components have certain asset attributes, we do not consider them as assets for the time being due to some other considerations (see reference for details).

### Pricing function

Components are purchased and decomposed based on the erc7527 interface specification. The following are the functions utilized



```
purchase：(swap + mintFee) * grade_

resolve:  (swap * abration_) / 100
```

Oracle core code：

```
swap = _asset.premium + (input * _asset.premium) / 100;

fee = (swap * _asset.mintFeePercent) / 10000;
```

![image-20240124223706810](img/image-20240124223706810.png)

![image-20240124223720124](img/image-20240124223720124.png)

### Limited regulation

As you can see by now, the entry and exit of our game will be much easier than most chain games (like xpet) at this stage, any time you don't want to play our game, you just need to break the components into LLT tokens, exchange them for the coins you want through uniswap and exit, which also leads to a problem, If a large number of players at the same time a large number of exit may lead to our LLT currency price breakdown, in order to prevent such a situation, so we will wear speed, charging speed, wear recovery speed and other properties written into the agent contract (<u> specific principles refer to the scalable 721 protocol </u>), through limited regulation, To ensure that the user's core assets are decentralized and safe under the premise of limited regulation.

# other information

## Official website information

**🦅 Twitter:**  https://twitter.com/Lotloot_gamefi

**🌎 Website:**  https://lot-loot.vercel.app/

💬 github: https://github.com/cuitFreeKingdom/LotLoot

✅ gitee: https://gitee.com/du-mingsong/warp-hack-thon （latest）

## roadMap

1. **Build base gameplay — 2023.10 - 2023.11 ** （done）

   Completed the development of the basic pvp mode of parking spot grabbing game

2. **Perfect economic model — 2023.12 - 2024.1.25** （done）

   By introducing the ERC-7527 standard and the concept of durability, we strive for the playability of the game, improve the economic model, and allow users to enter easily on the premise of ensuring the stability of the currency price. Online game, through the free casting vehicle nft mode to attract users to enter.

3. **Open pledge model— 2024.1.25 - 2024.2.1**

   The injection of liquidity into uniswap began, the pricing function was refined, and vehicles and parking Spaces became part of the resources purchased and decomposed. Turn on pledge mode at the same time

4. **Optimized economic model — 2024.2.1 - 2024.2.15**

   Dig deeper into the erc7527 protocol to provide users with a more equitable, non-project gaming experience.

5. **Expand the social nature of games — 2024.2.15 - 2024.3.1**

   Increased gameplay for fleets and fleet equity, enhanced player interaction and collaboration.

