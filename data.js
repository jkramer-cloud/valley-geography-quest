'use strict';
// States: postal abbreviation | state | capital | region | short factual note
const STATE_ROWS=`AL|Alabama|Montgomery|South|Known for the U.S. Space & Rocket Center in Huntsville
AK|Alaska|Juneau|West|The largest U.S. state by land area
AZ|Arizona|Phoenix|West|Home to Grand Canyon National Park
AR|Arkansas|Little Rock|South|The Ozark Mountains extend into northern Arkansas
CA|California|Sacramento|West|Home to Yosemite National Park
CO|Colorado|Denver|West|The Rocky Mountains run through Colorado
CT|Connecticut|Hartford|Northeast|One of the original thirteen states
DE|Delaware|Dover|South|First state to ratify the U.S. Constitution
FL|Florida|Tallahassee|South|The Florida Keys extend southwest from the peninsula
GA|Georgia|Atlanta|South|The Appalachian Mountains reach northern Georgia
HI|Hawaii|Honolulu|West|The only U.S. state made entirely of islands
ID|Idaho|Boise|West|Hells Canyon lies along part of the Idaho–Oregon border
IL|Illinois|Springfield|Midwest|Chicago lies along Lake Michigan
IN|Indiana|Indianapolis|Midwest|Indiana borders Lake Michigan
IA|Iowa|Des Moines|Midwest|Iowa sits between the Mississippi and Missouri Rivers
KS|Kansas|Topeka|Midwest|The geographic center of the contiguous U.S. is near Lebanon, Kansas
KY|Kentucky|Frankfort|South|Mammoth Cave National Park is in Kentucky
LA|Louisiana|Baton Rouge|South|The Mississippi River flows through Louisiana
ME|Maine|Augusta|Northeast|The easternmost state in the contiguous United States
MD|Maryland|Annapolis|South|Maryland surrounds much of Chesapeake Bay
MA|Massachusetts|Boston|Northeast|Boston played a major role in the American Revolution
MI|Michigan|Lansing|Midwest|Michigan touches four of the Great Lakes
MN|Minnesota|Saint Paul|Midwest|The Mississippi River begins at Lake Itasca
MS|Mississippi|Jackson|South|The state shares its name with the Mississippi River
MO|Missouri|Jefferson City|Midwest|The Missouri and Mississippi Rivers meet near St. Louis
MT|Montana|Helena|West|Glacier National Park is in northern Montana
NE|Nebraska|Lincoln|Midwest|Chimney Rock is a landmark along the Oregon Trail
NV|Nevada|Carson City|West|Much of Nevada is part of the Great Basin
NH|New Hampshire|Concord|Northeast|Mount Washington is in the White Mountains
NJ|New Jersey|Trenton|Northeast|New Jersey borders the Atlantic Ocean
NM|New Mexico|Santa Fe|West|White Sands National Park is in southern New Mexico
NY|New York|Albany|Northeast|The Adirondack Mountains are in northern New York
NC|North Carolina|Raleigh|South|The Outer Banks are barrier islands off its coast
ND|North Dakota|Bismarck|Midwest|Theodore Roosevelt National Park is in North Dakota
OH|Ohio|Columbus|Midwest|Lake Erie borders northern Ohio
OK|Oklahoma|Oklahoma City|South|Part of historic Route 66 crosses Oklahoma
OR|Oregon|Salem|West|Crater Lake is the deepest lake in the United States
PA|Pennsylvania|Harrisburg|Northeast|Philadelphia hosted the signing of the Declaration of Independence
RI|Rhode Island|Providence|Northeast|The smallest state by land area
SC|South Carolina|Columbia|South|The Blue Ridge Mountains touch northwestern South Carolina
SD|South Dakota|Pierre|Midwest|Mount Rushmore is in the Black Hills
TN|Tennessee|Nashville|South|Great Smoky Mountains National Park reaches Tennessee
TX|Texas|Austin|South|Big Bend National Park lies along the Rio Grande
UT|Utah|Salt Lake City|West|The Great Salt Lake is in northern Utah
VT|Vermont|Montpelier|Northeast|The Green Mountains run through Vermont
VA|Virginia|Richmond|South|Shenandoah National Park is in Virginia
WA|Washington|Olympia|West|Mount Rainier is a volcano in the Cascade Range
WV|West Virginia|Charleston|South|The New River Gorge is in West Virginia
WI|Wisconsin|Madison|Midwest|Wisconsin borders Lakes Michigan and Superior
WY|Wyoming|Cheyenne|West|Yellowstone National Park extends into Wyoming`;
const STATES=STATE_ROWS.split('\n').map(line=>{let [ab,name,capital,region,fact]=line.split('|');return {ab,name,capital,region,fact}});
const BY_AB=Object.fromEntries(STATES.map(s=>[s.ab,s]));
const MODES=[
{id:'locate',label:'Find the State',detail:'Find the prompted state. Each correct click awards points and advances automatically.'},
{id:'name',label:'Type the State',detail:'A state lights up. Type its name.'},
{id:'bank',label:'Name Bank Match',detail:'Choose a name from the bank, then click the glowing state.'},
{id:'capital',label:'Capital Challenge',detail:'Name the capital of a highlighted state.'},
{id:'sprint',label:'90-Second Map Sprint',detail:'Locate as many states as possible before time runs out.'},
{id:'pnw',label:'PNW Explorer',detail:'Identify numbered map markers for cities, mountains, rivers, and landmarks. The map zooms to the choices.'},
{id:'study',label:'State Explorer',detail:'Tap any state to reveal its capital, region, and facts; no pressure or penalties.'}
];
