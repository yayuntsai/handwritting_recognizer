/**
 * The $1 Unistroke Recognizer (JavaScript version)
 *
 *  Jacob O. Wobbrock, Ph.D.
 *  The Information School
 *  University of Washington
 *  Seattle, WA 98195-2840
 *  wobbrock@uw.edu
 *
 *  Andrew D. Wilson, Ph.D.
 *  Microsoft Research
 *  One Microsoft Way
 *  Redmond, WA 98052
 *  awilson@microsoft.com
 *
 *  Yang Li, Ph.D.
 *  Department of Computer Science and Engineering
 *  University of Washington
 *  Seattle, WA 98195-2840
 *  yangli@cs.washington.edu
 *
 * The academic publication for the $1 recognizer, and what should be
 * used to cite it, is:
 *
 *     Wobbrock, J.O., Wilson, A.D. and Li, Y. (2007). Gestures without
 *     libraries, toolkits or training: A $1 recognizer for user interface
 *     prototypes. Proceedings of the ACM Symposium on User Interface
 *     Software and Technology (UIST '07). Newport, Rhode Island (October
 *     7-10, 2007). New York: ACM Press, pp. 159-168.
 *     https://dl.acm.org/citation.cfm?id=1294238
 *
 * The Protractor enhancement was separately published by Yang Li and programmed
 * here by Jacob O. Wobbrock:
 *
 *     Li, Y. (2010). Protractor: A fast and accurate gesture
 *     recognizer. Proceedings of the ACM Conference on Human
 *     Factors in Computing Systems (CHI '10). Atlanta, Georgia
 *     (April 10-15, 2010). New York: ACM Press, pp. 2169-2172.
 *     https://dl.acm.org/citation.cfm?id=1753654
 *
 * This software is distributed under the "New BSD License" agreement:
 *
 * Copyright (C) 2007-2012, Jacob O. Wobbrock, Andrew D. Wilson and Yang Li.
 * All rights reserved. Last updated July 14, 2018.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *    * Redistributions of source code must retain the above copyright
 *      notice, this list of conditions and the following disclaimer.
 *    * Redistributions in binary form must reproduce the above copyright
 *      notice, this list of conditions and the following disclaimer in the
 *      documentation and/or other materials provided with the distribution.
 *    * Neither the names of the University of Washington nor Microsoft,
 *      nor the names of its contributors may be used to endorse or promote
 *      products derived from this software without specific prior written
 *      permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS
 * IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
 * THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
 * PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL Jacob O. Wobbrock OR Andrew D. Wilson
 * OR Yang Li BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
 * OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY
 * OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
**/
//
// Point class
//
function Point(x, y) // constructor
{
	this.X = x;
	this.Y = y;
}
//
// Rectangle class
//
function Rectangle(x, y, width, height) // constructor
{
	this.X = x;
	this.Y = y;
	this.Width = width;
	this.Height = height;
}
//
// Unistroke class: a unistroke template
//
function Unistroke(name, points) // constructor
{
	this.Name = name;
	this.Points = Resample(points, NumPoints);
	var radians = IndicativeAngle(this.Points);
	this.Points = RotateBy(this.Points, -radians);
	this.Points = ScaleTo(this.Points, SquareSize);
	console.log(this.Points);
	this.Points = TranslateTo(this.Points, Origin);
	this.Vector = Vectorize(this.Points); // for Protractor
}
//
// Result class
//
function Result(name, score, ms) // constructor
{
	this.Name = name;
	this.Score = score;
	this.Time = ms;
}
//
// DollarRecognizer constants
//
const NumUnistrokes = 26;
const NumPoints = 64;
const SquareSize = 250.0;
const Origin = new Point(0,0);
const Diagonal = Math.sqrt(SquareSize * SquareSize + SquareSize * SquareSize);
const HalfDiagonal = 0.5 * Diagonal;
const AngleRange = Deg2Rad(45.0);
const AnglePrecision = Deg2Rad(2.0);
const Phi = 0.5 * (-1.0 + Math.sqrt(5.0)); // Golden Ratio
//
// DollarRecognizer class
//
function DollarRecognizer() // constructor
{
	//
	// one built-in unistroke per gesture type
	//
	this.Unistrokes = new Array(NumUnistrokes);
	this.Unistrokes[0] = new Unistroke("triangle", new Array(new Point(137,139),new Point(135,141),new Point(133,144),new Point(132,146),new Point(130,149),new Point(128,151),new Point(126,155),new Point(123,160),new Point(120,166),new Point(116,171),new Point(112,177),new Point(107,183),new Point(102,188),new Point(100,191),new Point(95,195),new Point(90,199),new Point(86,203),new Point(82,206),new Point(80,209),new Point(75,213),new Point(73,213),new Point(70,216),new Point(67,219),new Point(64,221),new Point(61,223),new Point(60,225),new Point(62,226),new Point(65,225),new Point(67,226),new Point(74,226),new Point(77,227),new Point(85,229),new Point(91,230),new Point(99,231),new Point(108,232),new Point(116,233),new Point(125,233),new Point(134,234),new Point(145,233),new Point(153,232),new Point(160,233),new Point(170,234),new Point(177,235),new Point(179,236),new Point(186,237),new Point(193,238),new Point(198,239),new Point(200,237),new Point(202,239),new Point(204,238),new Point(206,234),new Point(205,230),new Point(202,222),new Point(197,216),new Point(192,207),new Point(186,198),new Point(179,189),new Point(174,183),new Point(170,178),new Point(164,171),new Point(161,168),new Point(154,160),new Point(148,155),new Point(143,150),new Point(138,148),new Point(136,148)));
	this.Unistrokes[1] = new Unistroke("x", new Array(new Point(87,142),new Point(89,145),new Point(91,148),new Point(93,151),new Point(96,155),new Point(98,157),new Point(100,160),new Point(102,162),new Point(106,167),new Point(108,169),new Point(110,171),new Point(115,177),new Point(119,183),new Point(123,189),new Point(127,193),new Point(129,196),new Point(133,200),new Point(137,206),new Point(140,209),new Point(143,212),new Point(146,215),new Point(151,220),new Point(153,222),new Point(155,223),new Point(157,225),new Point(158,223),new Point(157,218),new Point(155,211),new Point(154,208),new Point(152,200),new Point(150,189),new Point(148,179),new Point(147,170),new Point(147,158),new Point(147,148),new Point(147,141),new Point(147,136),new Point(144,135),new Point(142,137),new Point(140,139),new Point(135,145),new Point(131,152),new Point(124,163),new Point(116,177),new Point(108,191),new Point(100,206),new Point(94,217),new Point(91,222),new Point(89,225),new Point(87,226),new Point(87,224)));
	this.Unistrokes[2] = new Unistroke("rectangle", new Array(new Point(78,149),new Point(78,153),new Point(78,157),new Point(78,160),new Point(79,162),new Point(79,164),new Point(79,167),new Point(79,169),new Point(79,173),new Point(79,178),new Point(79,183),new Point(80,189),new Point(80,193),new Point(80,198),new Point(80,202),new Point(81,208),new Point(81,210),new Point(81,216),new Point(82,222),new Point(82,224),new Point(82,227),new Point(83,229),new Point(83,231),new Point(85,230),new Point(88,232),new Point(90,233),new Point(92,232),new Point(94,233),new Point(99,232),new Point(102,233),new Point(106,233),new Point(109,234),new Point(117,235),new Point(123,236),new Point(126,236),new Point(135,237),new Point(142,238),new Point(145,238),new Point(152,238),new Point(154,239),new Point(165,238),new Point(174,237),new Point(179,236),new Point(186,235),new Point(191,235),new Point(195,233),new Point(197,233),new Point(200,233),new Point(201,235),new Point(201,233),new Point(199,231),new Point(198,226),new Point(198,220),new Point(196,207),new Point(195,195),new Point(195,181),new Point(195,173),new Point(195,163),new Point(194,155),new Point(192,145),new Point(192,143),new Point(192,138),new Point(191,135),new Point(191,133),new Point(191,130),new Point(190,128),new Point(188,129),new Point(186,129),new Point(181,132),new Point(173,131),new Point(162,131),new Point(151,132),new Point(149,132),new Point(138,132),new Point(136,132),new Point(122,131),new Point(120,131),new Point(109,130),new Point(107,130),new Point(90,132),new Point(81,133),new Point(76,133)));
	this.Unistrokes[3] = new Unistroke("zero", new Array(new Point(127,141),new Point(124,140),new Point(120,139),new Point(118,139),new Point(116,139),new Point(111,140),new Point(109,141),new Point(104,144),new Point(100,147),new Point(96,152),new Point(93,157),new Point(90,163),new Point(87,169),new Point(85,175),new Point(83,181),new Point(82,190),new Point(82,195),new Point(83,200),new Point(84,205),new Point(88,213),new Point(91,216),new Point(96,219),new Point(103,222),new Point(108,224),new Point(111,224),new Point(120,224),new Point(133,223),new Point(142,222),new Point(152,218),new Point(160,214),new Point(167,210),new Point(173,204),new Point(178,198),new Point(179,196),new Point(182,188),new Point(182,177),new Point(178,167),new Point(170,150),new Point(163,138),new Point(152,130),new Point(143,129),new Point(140,131),new Point(129,136),new Point(126,139)));
	this.Unistrokes[4] = new Unistroke("check", new Array(new Point(91,185),new Point(93,185),new Point(95,185),new Point(97,185),new Point(100,188),new Point(102,189),new Point(104,190),new Point(106,193),new Point(108,195),new Point(110,198),new Point(112,201),new Point(114,204),new Point(115,207),new Point(117,210),new Point(118,212),new Point(120,214),new Point(121,217),new Point(122,219),new Point(123,222),new Point(124,224),new Point(126,226),new Point(127,229),new Point(129,231),new Point(130,233),new Point(129,231),new Point(129,228),new Point(129,226),new Point(129,224),new Point(129,221),new Point(129,218),new Point(129,212),new Point(129,208),new Point(130,198),new Point(132,189),new Point(134,182),new Point(137,173),new Point(143,164),new Point(147,157),new Point(151,151),new Point(155,144),new Point(161,137),new Point(165,131),new Point(171,122),new Point(174,118),new Point(176,114),new Point(177,112),new Point(177,114),new Point(175,116),new Point(173,118)));
	this.Unistrokes[5] = new Unistroke("caret", new Array(new Point(79,245),new Point(79,242),new Point(79,239),new Point(80,237),new Point(80,234),new Point(81,232),new Point(82,230),new Point(84,224),new Point(86,220),new Point(86,218),new Point(87,216),new Point(88,213),new Point(90,207),new Point(91,202),new Point(92,200),new Point(93,194),new Point(94,192),new Point(96,189),new Point(97,186),new Point(100,179),new Point(102,173),new Point(105,165),new Point(107,160),new Point(109,158),new Point(112,151),new Point(115,144),new Point(117,139),new Point(119,136),new Point(119,134),new Point(120,132),new Point(121,129),new Point(122,127),new Point(124,125),new Point(126,124),new Point(129,125),new Point(131,127),new Point(132,130),new Point(136,139),new Point(141,154),new Point(145,166),new Point(151,182),new Point(156,193),new Point(157,196),new Point(161,209),new Point(162,211),new Point(167,223),new Point(169,229),new Point(170,231),new Point(173,237),new Point(176,242),new Point(177,244),new Point(179,250),new Point(181,255),new Point(182,257)));
	this.Unistrokes[6] = new Unistroke("zig-zag", new Array(new Point(307,216),new Point(333,186),new Point(356,215),new Point(375,186),new Point(399,216),new Point(418,186)));
	this.Unistrokes[7] = new Unistroke("arrow", new Array(new Point(68,222),new Point(70,220),new Point(73,218),new Point(75,217),new Point(77,215),new Point(80,213),new Point(82,212),new Point(84,210),new Point(87,209),new Point(89,208),new Point(92,206),new Point(95,204),new Point(101,201),new Point(106,198),new Point(112,194),new Point(118,191),new Point(124,187),new Point(127,186),new Point(132,183),new Point(138,181),new Point(141,180),new Point(146,178),new Point(154,173),new Point(159,171),new Point(161,170),new Point(166,167),new Point(168,167),new Point(171,166),new Point(174,164),new Point(177,162),new Point(180,160),new Point(182,158),new Point(183,156),new Point(181,154),new Point(178,153),new Point(171,153),new Point(164,153),new Point(160,153),new Point(150,154),new Point(147,155),new Point(141,157),new Point(137,158),new Point(135,158),new Point(137,158),new Point(140,157),new Point(143,156),new Point(151,154),new Point(160,152),new Point(170,149),new Point(179,147),new Point(185,145),new Point(192,144),new Point(196,144),new Point(198,144),new Point(200,144),new Point(201,147),new Point(199,149),new Point(194,157),new Point(191,160),new Point(186,167),new Point(180,176),new Point(177,179),new Point(171,187),new Point(169,189),new Point(165,194),new Point(164,196)));
	this.Unistrokes[8] = new Unistroke("left square bracket", new Array(new Point(140,124),new Point(138,123),new Point(135,122),new Point(133,123),new Point(130,123),new Point(128,124),new Point(125,125),new Point(122,124),new Point(120,124),new Point(118,124),new Point(116,125),new Point(113,125),new Point(111,125),new Point(108,124),new Point(106,125),new Point(104,125),new Point(102,124),new Point(100,123),new Point(98,123),new Point(95,124),new Point(93,123),new Point(90,124),new Point(88,124),new Point(85,125),new Point(83,126),new Point(81,127),new Point(81,129),new Point(82,131),new Point(82,134),new Point(83,138),new Point(84,141),new Point(84,144),new Point(85,148),new Point(85,151),new Point(86,156),new Point(86,160),new Point(86,164),new Point(86,168),new Point(87,171),new Point(87,175),new Point(87,179),new Point(87,182),new Point(87,186),new Point(88,188),new Point(88,195),new Point(88,198),new Point(88,201),new Point(88,207),new Point(89,211),new Point(89,213),new Point(89,217),new Point(89,222),new Point(88,225),new Point(88,229),new Point(88,231),new Point(88,233),new Point(88,235),new Point(89,237),new Point(89,240),new Point(89,242),new Point(91,241),new Point(94,241),new Point(96,240),new Point(98,239),new Point(105,240),new Point(109,240),new Point(113,239),new Point(116,240),new Point(121,239),new Point(130,240),new Point(136,237),new Point(139,237),new Point(144,238),new Point(151,237),new Point(157,236),new Point(159,237)));
	this.Unistrokes[9] = new Unistroke("right square bracket", new Array(new Point(112,138),new Point(112,136),new Point(115,136),new Point(118,137),new Point(120,136),new Point(123,136),new Point(125,136),new Point(128,136),new Point(131,136),new Point(134,135),new Point(137,135),new Point(140,134),new Point(143,133),new Point(145,132),new Point(147,132),new Point(149,132),new Point(152,132),new Point(153,134),new Point(154,137),new Point(155,141),new Point(156,144),new Point(157,152),new Point(158,161),new Point(160,170),new Point(162,182),new Point(164,192),new Point(166,200),new Point(167,209),new Point(168,214),new Point(168,216),new Point(169,221),new Point(169,223),new Point(169,228),new Point(169,231),new Point(166,233),new Point(164,234),new Point(161,235),new Point(155,236),new Point(147,235),new Point(140,233),new Point(131,233),new Point(124,233),new Point(117,235),new Point(114,238),new Point(112,238)));
	this.Unistrokes[10] = new Unistroke("v", new Array(new Point(89,164),new Point(90,162),new Point(92,162),new Point(94,164),new Point(95,166),new Point(96,169),new Point(97,171),new Point(99,175),new Point(101,178),new Point(103,182),new Point(106,189),new Point(108,194),new Point(111,199),new Point(114,204),new Point(117,209),new Point(119,214),new Point(122,218),new Point(124,222),new Point(126,225),new Point(128,228),new Point(130,229),new Point(133,233),new Point(134,236),new Point(136,239),new Point(138,240),new Point(139,242),new Point(140,244),new Point(142,242),new Point(142,240),new Point(142,237),new Point(143,235),new Point(143,233),new Point(145,229),new Point(146,226),new Point(148,217),new Point(149,208),new Point(149,205),new Point(151,196),new Point(151,193),new Point(153,182),new Point(155,172),new Point(157,165),new Point(159,160),new Point(162,155),new Point(164,150),new Point(165,148),new Point(166,146)));
	this.Unistrokes[11] = new Unistroke("delete", new Array(new Point(123,129),new Point(123,131),new Point(124,133),new Point(125,136),new Point(127,140),new Point(129,142),new Point(133,148),new Point(137,154),new Point(143,158),new Point(145,161),new Point(148,164),new Point(153,170),new Point(158,176),new Point(160,178),new Point(164,183),new Point(168,188),new Point(171,191),new Point(175,196),new Point(178,200),new Point(180,202),new Point(181,205),new Point(184,208),new Point(186,210),new Point(187,213),new Point(188,215),new Point(186,212),new Point(183,211),new Point(177,208),new Point(169,206),new Point(162,205),new Point(154,207),new Point(145,209),new Point(137,210),new Point(129,214),new Point(122,217),new Point(118,218),new Point(111,221),new Point(109,222),new Point(110,219),new Point(112,217),new Point(118,209),new Point(120,207),new Point(128,196),new Point(135,187),new Point(138,183),new Point(148,167),new Point(157,153),new Point(163,145),new Point(165,142),new Point(172,133),new Point(177,127),new Point(179,127),new Point(180,125)));
	this.Unistrokes[12] = new Unistroke("left curly brace", new Array(new Point(150,116),new Point(147,117),new Point(145,116),new Point(142,116),new Point(139,117),new Point(136,117),new Point(133,118),new Point(129,121),new Point(126,122),new Point(123,123),new Point(120,125),new Point(118,127),new Point(115,128),new Point(113,129),new Point(112,131),new Point(113,134),new Point(115,134),new Point(117,135),new Point(120,135),new Point(123,137),new Point(126,138),new Point(129,140),new Point(135,143),new Point(137,144),new Point(139,147),new Point(141,149),new Point(140,152),new Point(139,155),new Point(134,159),new Point(131,161),new Point(124,166),new Point(121,166),new Point(117,166),new Point(114,167),new Point(112,166),new Point(114,164),new Point(116,163),new Point(118,163),new Point(120,162),new Point(122,163),new Point(125,164),new Point(127,165),new Point(129,166),new Point(130,168),new Point(129,171),new Point(127,175),new Point(125,179),new Point(123,184),new Point(121,190),new Point(120,194),new Point(119,199),new Point(120,202),new Point(123,207),new Point(127,211),new Point(133,215),new Point(142,219),new Point(148,220),new Point(151,221)));
	this.Unistrokes[13] = new Unistroke("right curly brace", new Array(new Point(117,132),new Point(115,132),new Point(115,129),new Point(117,129),new Point(119,128),new Point(122,127),new Point(125,127),new Point(127,127),new Point(130,127),new Point(133,129),new Point(136,129),new Point(138,130),new Point(140,131),new Point(143,134),new Point(144,136),new Point(145,139),new Point(145,142),new Point(145,145),new Point(145,147),new Point(145,149),new Point(144,152),new Point(142,157),new Point(141,160),new Point(139,163),new Point(137,166),new Point(135,167),new Point(133,169),new Point(131,172),new Point(128,173),new Point(126,176),new Point(125,178),new Point(125,180),new Point(125,182),new Point(126,184),new Point(128,187),new Point(130,187),new Point(132,188),new Point(135,189),new Point(140,189),new Point(145,189),new Point(150,187),new Point(155,186),new Point(157,185),new Point(159,184),new Point(156,185),new Point(154,185),new Point(149,185),new Point(145,187),new Point(141,188),new Point(136,191),new Point(134,191),new Point(131,192),new Point(129,193),new Point(129,195),new Point(129,197),new Point(131,200),new Point(133,202),new Point(136,206),new Point(139,211),new Point(142,215),new Point(145,220),new Point(147,225),new Point(148,231),new Point(147,239),new Point(144,244),new Point(139,248),new Point(134,250),new Point(126,253),new Point(119,253),new Point(115,253)));
	this.Unistrokes[14] = new Unistroke("star", new Array(new Point(75,250),new Point(75,247),new Point(77,244),new Point(78,242),new Point(79,239),new Point(80,237),new Point(82,234),new Point(82,232),new Point(84,229),new Point(85,225),new Point(87,222),new Point(88,219),new Point(89,216),new Point(91,212),new Point(92,208),new Point(94,204),new Point(95,201),new Point(96,196),new Point(97,194),new Point(98,191),new Point(100,185),new Point(102,178),new Point(104,173),new Point(104,171),new Point(105,164),new Point(106,158),new Point(107,156),new Point(107,152),new Point(108,145),new Point(109,141),new Point(110,139),new Point(112,133),new Point(113,131),new Point(116,127),new Point(117,125),new Point(119,122),new Point(121,121),new Point(123,120),new Point(125,122),new Point(125,125),new Point(127,130),new Point(128,133),new Point(131,143),new Point(136,153),new Point(140,163),new Point(144,172),new Point(145,175),new Point(151,189),new Point(156,201),new Point(161,213),new Point(166,225),new Point(169,233),new Point(171,236),new Point(174,243),new Point(177,247),new Point(178,249),new Point(179,251),new Point(180,253),new Point(180,255),new Point(179,257),new Point(177,257),new Point(174,255),new Point(169,250),new Point(164,247),new Point(160,245),new Point(149,238),new Point(138,230),new Point(127,221),new Point(124,220),new Point(112,212),new Point(110,210),new Point(96,201),new Point(84,195),new Point(74,190),new Point(64,182),new Point(55,175),new Point(51,172),new Point(49,170),new Point(51,169),new Point(56,169),new Point(66,169),new Point(78,168),new Point(92,166),new Point(107,164),new Point(123,161),new Point(140,162),new Point(156,162),new Point(171,160),new Point(173,160),new Point(186,160),new Point(195,160),new Point(198,161),new Point(203,163),new Point(208,163),new Point(206,164),new Point(200,167),new Point(187,172),new Point(174,179),new Point(172,181),new Point(153,192),new Point(137,201),new Point(123,211),new Point(112,220),new Point(99,229),new Point(90,237),new Point(80,244),new Point(73,250),new Point(69,254),new Point(69,252)));
	this.Unistrokes[15] = new Unistroke("pigtail", new Array(new Point(81,219),new Point(84,218),new Point(86,220),new Point(88,220),new Point(90,220),new Point(92,219),new Point(95,220),new Point(97,219),new Point(99,220),new Point(102,218),new Point(105,217),new Point(107,216),new Point(110,216),new Point(113,214),new Point(116,212),new Point(118,210),new Point(121,208),new Point(124,205),new Point(126,202),new Point(129,199),new Point(132,196),new Point(136,191),new Point(139,187),new Point(142,182),new Point(144,179),new Point(146,174),new Point(148,170),new Point(149,168),new Point(151,162),new Point(152,160),new Point(152,157),new Point(152,155),new Point(152,151),new Point(152,149),new Point(152,146),new Point(149,142),new Point(148,139),new Point(145,137),new Point(141,135),new Point(139,135),new Point(134,136),new Point(130,140),new Point(128,142),new Point(126,145),new Point(122,150),new Point(119,158),new Point(117,163),new Point(115,170),new Point(114,175),new Point(117,184),new Point(120,190),new Point(125,199),new Point(129,203),new Point(133,208),new Point(138,213),new Point(145,215),new Point(155,218),new Point(164,219),new Point(166,219),new Point(177,219),new Point(182,218),new Point(192,216),new Point(196,213),new Point(199,212),new Point(201,211)));
	this.Unistrokes[16] = new Unistroke("zero", new Array(new Point(127,141),new Point(124,140),new Point(120,139),new Point(118,139),new Point(116,139),new Point(111,140),new Point(109,141),new Point(104,144),new Point(100,147),new Point(96,152),new Point(93,157),new Point(90,163),new Point(87,169),new Point(85,175),new Point(83,181),new Point(82,190),new Point(82,195),new Point(83,200),new Point(84,205),new Point(88,213),new Point(91,216),new Point(96,219),new Point(103,222),new Point(108,224),new Point(111,224),new Point(120,224),new Point(133,223),new Point(142,222),new Point(152,218),new Point(160,214),new Point(167,210),new Point(173,204),new Point(178,198),new Point(179,196),new Point(182,188),new Point(182,177),new Point(178,167),new Point(170,150),new Point(163,138),new Point(152,130),new Point(143,129),new Point(140,131),new Point(129,136),new Point(126,139)));
	this.Unistrokes[17] = new Unistroke("one", new Array(new Point(87,270),new Point(87,271),new Point(87,272),new Point(87,273),new Point(87,274),new Point(87,275),new Point(87,277),new Point(87,279),new Point(87,280),new Point(88,281),new Point(87,282),new Point(89,284),new Point(87,285),new Point(88,286),new Point(87,286),new Point(86,288),new Point(89,289),new Point(87,290),new Point(87,291),new Point(87,292),new Point(87,293)));
	this.Unistrokes[18] = new Unistroke("two", new Array(new Point(190,326),new Point(193,316),new Point(198,304),new Point(201,292),new Point(204,281),new Point(209,270),new Point(239,368),new Point(237,381),new Point(236,393),new Point(237,460),new Point(238,460),new Point(245,452),new Point(252,444),new Point(255,436),new Point(254,428),new Point(272,420),new Point(279,412),new Point(286,404),new Point(299,387),new Point(305,378),new Point(312,370),new Point(319,362),new Point(326,354),new Point(333,346),new Point(340,338),new Point(347,330),new Point(354,323),new Point(361,315),new Point(368,308),new Point(376,300),new Point(391,286),new Point(398,278),new Point(405,272),new Point(413,266),new Point(420,259),new Point(436,282),new Point(440,293)));
	this.Unistrokes[19] = new Unistroke("three", new Array(new Point(448.57854062451526,372.65403606270456),new Point(451.0292219434909,362.6655547928736),new Point(452.35777879075476,352.3861367414242),new Point(454.57652792982236,342.2326254253416),new Point(458.8808227115654,332.919190207078),new Point(463.66297621909814,323.7982406795879),new Point(469.9705285783994,315.7837879457667),new Point(477.7019258985353,309.3902640204916),new Point(485.49683188039194,302.9856304848187),new Point(493.78984198248094,297.4696537906824),new Point(502.2862780554847,292.3558204911875),new Point(510.9858291238028,288.46582137181997),new Point(519.7757683819083,284.77707486679594),new Point(528.5317388453228,280.4966627247597),new Point(538.2921226252878,279.8302841080575),new Point(547.6071650059137,282.40374931262846),new Point(556.7015614180036,285.8081879851866),new Point(565.6410090404746,288.2335321419183),new Point(574.3021775422599,293.2695478672705),new Point(580.6606847441559,300.98105074321177),new Point(583.7020992799052,310.6990569186406),new Point(584.6857440464565,321.0374663770594),new Point(585.5195324359412,331.3836293132956),new Point(587.621155910572,341.53802632024167),new Point(587.6147192938664,351.8977396718738),new Point(588.2334443753213,362.28495224004973),new Point(589.6000491985192,372.60383588877716),new Point(586.2640934355315,382.07601857218407),new Point(586.2449205497411,392.2294115266401),new Point(583.4732311028796,401.58801871931877),new Point(579.6682614589753,408.84519606024185),new Point(584.4504149665081,399.7242465327518),new Point(589.2325684740408,390.6032970052617),new Point(594.0147219815736,381.48234747777167),new Point(600.3530691797382,374.41464033652727),new Point(606.8898722445235,366.96842047292284),new Point(613.2282194426882,359.9007133316785),new Point(619.379766930331,354.69218859127847),new Point(628.6888580314946,353.64972776871105),new Point(638.3696421798484,352.701232446996),new Point(647.3090898023194,355.12657660372776),new Point(656.6170716257344,354.0945224544055),new Point(665.7293896735986,354.89808520146056),new Point(674.6449346681632,357.54767151813803),new Point(683.345159412889,362.21728166203417),new Point(691.4727847395147,367.7017536853105),new Point(695.5943367784464,376.55342986273115),new Point(698.062215325325,383.88784119305114),new Point(698.5785406245153,393.6351257677027),new Point(698.0490847407907,403.63138821268865),new Point(696.625267566021,413.74125545491864),new Point(695.2014503912515,423.85112269714864),new Point(692.4756940892045,433.26659348527494),new Point(688.4080255629011,442.47200253421227),new Point(685.6906824952051,451.8370340315261),new Point(681.3227878914925,461.0069532500399),new Point(676.5406343839596,470.12790277753),new Point(672.8999290145534,479.67894397203423),new Point(669.1747377344439,489.19815131884997),new Point(664.392584226911,498.31910084634),new Point(659.6104307193782,507.44005037383016),new Point(654.8282772118455,516.5609999013202),new Point(648.2914741470604,524.0072197649247),new Point(642.6056985813419,529.8302841080575)));
	this.Unistrokes[20] = new Unistroke("four", new Array(new Point(208.13679775683218,650.1790923456745),new Point(214.51181451561882,652.832978284883),new Point(220.8868312744055,655.4868642240915),new Point(227.2618480331921,658.1407501633),new Point(233.63686479197875,660.7946361025084),new Point(240.0118815507654,663.448522041717),new Point(246.38689830955207,666.1024079809255),new Point(252.76191506833868,668.7562939201341),new Point(259.1369318271253,671.4101798593426),new Point(265.51194858591197,674.0640657985512),new Point(271.8869653446986,676.7179517377596),new Point(278.26198210348525,679.3718376769681),new Point(284.63699886227187,682.0257236161766),new Point(290.201315284391,686.4518037672365),new Point(296.13948806439146,690.0606324092806),new Point(302.5145048231781,692.714518348489),new Point(308.88952158196474,695.3684042876977),new Point(315.26453834075136,698.0222902269062),new Point(321.639555099538,700.6761761661147),new Point(328.01457185832464,703.3300621053232),new Point(334.3895886171113,705.9839480445318),new Point(340.76460537589793,708.6378339837402),new Point(347.03899125437385,711.5485623956675),new Point(352.85217232208254,715.6364342814622),new Point(358.79605460825235,719.390714490097),new Point(365.171071367039,722.0446004293054),new Point(371.5460881258256,724.698486368514),new Point(377.3418702821953,728.6185814891901),new Point(383.0485773279451,732.733395161618),new Point(389.4235940867318,735.3872811008265),new Point(395.7986108455184,738.0411670400349),new Point(399.35256561891515,733.7275769995233),new Point(401.58612571255384,726.1528681808318),new Point(402.8203696854012,718.2897289140773),new Point(403.7603119030434,710.3416459689878),new Point(404.8779981441218,702.4267194413378),new Point(406.03312194980185,694.5187765269529),new Point(407.26607723585414,686.6279939591175),new Point(408.5756254035504,678.7540986506011),new Point(409.8851735712467,670.8802033420847),new Point(411.93830229980404,663.2470725211901),new Point(414.1718623934428,655.6723637024986),new Point(416.40542248708147,648.0976548838072),new Point(418.63898258072015,640.5229460651157),new Point(420.87254267435884,632.9482372464241),new Point(423.1061027679976,625.3735284277327),new Point(425.3396628616363,617.7988196090413),new Point(427.57322295527496,610.2241107903498),new Point(429.80678304891376,602.6494019716582),new Point(432.04034314255244,595.0746931529668),new Point(434.27390323619113,587.4999843342753),new Point(436.5074633298299,579.9252755155837),new Point(438.74102342346856,572.3505666968923),new Point(440.97458351710725,564.7758578782009),new Point(443.208143610746,557.2011490595094),new Point(445.44170370438474,549.6264402408179),new Point(446.4304188447211,541.7294940959027),new Point(447.37028808280445,533.8199038278),new Point(449.60384817644314,526.2451950091084),new Point(451.83740827008194,518.670486190417),new Point(451.4361174759162,510.76529349610905),new Point(453.6696775695549,503.1905846774175),new Point(455.90323766319364,495.61587585872604),new Point(458.13679775683215,488.04116704003496),));
	this.Unistrokes[21] = new Unistroke("five", new Array(new Point(145.6492042166519,292.64087144153655),new Point(150.37867484653623,303.1275399358092),new Point(156.63243414018936,312.63707928860543),new Point(160.90835091809802,323.38642352356527),new Point(164.6729880567711,334.4585645151088),new Point(169.37871606217334,345.03999369488974),new Point(173.56283111094555,355.8934068541523),new Point(177.3274682496186,366.9655478456958),new Point(181.09210538829163,378.03768883723933),new Point(184.8567425269647,389.1098298287829),new Point(188.62137966563776,400.1819708203264),new Point(192.3860168043108,411.2541118118699),new Point(196.15065394298384,422.32625280341335),new Point(202.03976066790918,427.9540140254497),new Point(211.02487597089888,421.9802085199028),new Point(219.72537583270815,415.483576567573),new Point(228.220594676894,408.6464476279325),new Point(236.462136610972,401.37149456539186),new Point(245.37649432408753,395.1744733159323),new Point(254.45495135866344,389.29088322461024),new Point(263.9722309523458,384.44791604300264),new Point(272.0935376676527,377.2520882688439),new Point(268.8752575732609,368.18365658842697),new Point(262.74974609443365,358.62148432301916),new Point(256.17126634877957,349.405509499209),new Point(251.16533820637787,339.15763923473787),new Point(247.40070106770483,328.08549824319437),new Point(243.63606392903176,317.01335725165086),new Point(239.87142679035873,305.94121626010735),new Point(236.1067896516857,294.8690752685638),new Point(232.980656232574,283.55426030626637),new Point(230.35185301349372,272.0888408523309),new Point(229.28601469566976,260.28230658086545),new Point(228.28312220689463,248.46888325664725),new Point(227.83514711114134,236.62682326919833),new Point(229.11216793106047,224.87990465423138),new Point(231.3205558481525,213.28102750484263),new Point(234.2088509493724,201.92620552182765),new Point(240.13324668677203,192.4780259288536),new Point(249.39784749031824,187.16710080765242),new Point(259.1507081417465,182.89321700359287),new Point(268.90356879317477,178.61933319953332),new Point(279.25221411829153,178.1867545398806),new Point(289.70442704588305,177.95401402544965),new Point(300.0973950232604,178.55187785150486),new Point(310.31105725395327,180.26631147837722),new Point(320.73725824322185,179.87788056542112),new Point(330.74614264036524,183.29308443812067),new Point(340.68227968014077,186.9745771930558),new Point(350.74335048448717,190.1987547447343),new Point(358.3239827297612,197.5491783953817),new Point(367.4355056749444,203.06757743273934),new Point(373.9275736433856,212.3085550677759),new Point(379.60052846102934,222.24261514783842),new Point(384.2221906882123,232.7947030697443),new Point(388.4576282998382,243.58115670577325),new Point(392.2222654385112,254.65329769731676),new Point(392.66768171272906,266.4392901680296),new Point(393.2423334187299,278.18637862463663),new Point(395.64920421665187,289.47033382037597),new Point(394.6547861593938,301.2848967285597),new Point(394.433870864807,312.97879169322397),new Point(394.4006562507023,324.50465813847137),new Point(390.5208908358424,334.44733581754286),));
	this.Unistrokes[22] = new Unistroke("six", new Array(new Point(289.31585075938864,560.0724412514411),new Point(296.8728848462646,568.8463023804861),new Point(304.7212652882999,577.9584222008687),new Point(312.044054399237,588.1904404881759),new Point(319.28952605300776,598.306105737497),new Point(327.9108558337871,604.8819804045909),new Point(335.75923627582233,613.9941002249734),new Point(343.6076167178575,623.1062200453562),new Point(352.41035158703863,628.7212042896537),new Point(361.413890845003,633.6003610972327),new Point(370.1911760746539,639.5757186535266),new Point(378.9453781893761,645.5807338225329),new Point(388.3431593129879,646.8979839722764),new Point(397.47917089860215,650.8302284627704),new Point(406.7802463677787,653.345308448239),new Point(416.1545284542521,654.8581888556173),new Point(425.57817494756614,655.180997750832),new Point(434.8634673031155,652.9027302541656),new Point(444.15883940986237,650.3715413663264),new Point(453.5744236598701,649.5946787586948),new Point(462.9404472018399,648.4978048718374),new Point(472.1841086353839,645.2611566674166),new Point(481.4852874489255,644.7174532992515),new Point(490.72894888246947,641.4808050948305),new Point(499.9726103160136,638.2441568904098),new Point(508.76659285531423,632.645427815593),new Point(516.975963460646,624.7228109328851),new Point(525.123438690847,616.7363064711927),new Point(532.0991986117316,606.1758174982214),new Point(535.4077270235011,590.9685044444415),new Point(536.6390156038253,574.7586586021471),new Point(537.7617611120555,558.4334388625406),new Point(539.3158507593887,542.2374155599987),new Point(538.7861272327817,525.818598381605),new Point(537.0541974928791,509.6678818894704),new Point(536.1648459171919,493.3024523594526),new Point(534.8547742634237,477.0425205334756),new Point(532.9991496331778,460.91938889710104),new Point(529.8185684479612,445.79308970565336),new Point(524.3686707556012,432.37411315330775),new Point(517.3500123156805,422.6335130390741),new Point(509.50163187364524,413.5213932186916),new Point(500.4233106788473,409.49491890343745),new Point(491.4756691854717,405.18099775083203),new Point(482.2320077519276,408.41764595525285),new Point(472.9308289383861,408.961349323418),new Point(463.9662723578236,413.25967331101214),new Point(456.83271274212007,423.21966400444086),new Point(453.2835403618511,437.7225412790191),new Point(452.88231428699453,454.06791904359955),new Point(454.73793891724046,470.19105067997407),new Point(456.5935635474864,486.31418231634865),new Point(458.4491881777323,502.43731395272323),new Point(460.30481280797824,518.5604455890978),new Point(462.1604374382242,534.6835772254724),new Point(464.5336001080534,550.4679696172923),new Point(469.39470785040623,564.5324143356377),new Point(474.79260069692003,577.6433404598899),new Point(480.8569031817804,590.1994283548261),new Point(487.1761157713104,602.0285556300772),new Point(493.71050625346294,607.8798061024744),new Point(500.6804105787489,612.5898261850991),new Point(508.29351152220437,613.6259358114356),new Point(517.537172955748,610.3892876070149)));
	this.Unistrokes[23] = new Unistroke("seven", new Array(new Point(316.80292010632274,373.7686275910791),new Point(324.16609301979264,370.4726093817399),new Point(331.52926593326265,367.17659117240083),new Point(338.89243884673255,363.88057296306175),new Point(345.3827660426864,359.4448880091147),new Point(351.7456955173941,354.8428610048724),new Point(358.2659718946108,350.42734915406595),new Point(365.254632509939,346.5670484745324),new Point(372.24329312526714,342.7067477949988),new Point(379.2735986659609,338.90919405721576),new Point(386.6367715794308,335.6131758478766),new Point(393.99994449290074,332.3171576385375),new Point(401.1062509305742,328.642915653109),new Point(408.004459316309,324.6622590966196),new Point(414.9026677020439,320.6816025401302),new Point(422.2555845442703,317.37048274938945),new Point(429.6187574577402,314.07446454005037),new Point(436.2782653836031,309.8596773322189),new Point(442.6411948583108,305.2576503279766),new Point(449.0864656972283,300.76313569689756),new Point(456.44963861069823,297.4671174875585),new Point(463.8128115241682,294.1710992782193),new Point(471.1759844376381,290.8750810688802),new Point(478.5391573511081,287.57906285954107),new Point(485.902330264578,284.28304465020193),new Point(493.26550317804794,280.98702644086285),new Point(501.3177163354554,280.7777901195861),new Point(506.9929668001902,283.5255569836305),new Point(507.6222361862792,290.2723076369167),new Point(507.56694820758463,297.28022765909174),new Point(506.48644837562256,304.3092560621396),new Point(506.6792866631088,311.4893907441314),new Point(507.0941641055676,318.6634467685684),new Point(507.50904154802635,325.83750279300546),new Point(507.92391899048494,333.01155881744245),new Point(509.0651849083954,340.1208380716607),new Point(508.6432563902418,347.28514714693677),new Point(508.62826509839323,354.4333515771405),new Point(509.90730985568655,361.53034419890065),new Point(511.18635461298,368.6273368206608),new Point(512.4653993702733,375.7243294424209),new Point(513.2739225338652,382.8677659376357),new Point(513.868588219612,390.0323117076878),new Point(516.1387876080167,396.7882414185855),new Point(518.7836285720557,403.4660570040105),new Point(519.5796611825597,410.6159046847578),new Point(521.6471197944829,417.5563664517301),new Point(523.5251934147849,424.5388098216196),new Point(525.3124260088659,431.53862426030946),new Point(527.5412230632869,438.4540005663682),new Point(529.2153907108241,445.43907856235364),new Point(533.0180132360955,451.82129289996453),new Point(534.9656996601312,458.7288994249976),new Point(536.7665754996777,465.73733304324855),new Point(539.9305610397361,472.32426323488903),new Point(543.7331835650075,478.7064775725),new Point(545.2669715915569,485.7313166988506),new Point(546.5283895357613,492.2990175651912),new Point(548.8440158694494,498.78977009916224),new Point(551.5924300052372,505.2489327691427),new Point(555.3950525305086,511.63114710675364),new Point(559.19767505578,518.0133614443645),new Point(563.0002975810514,524.3955757819755),new Point(566.8029201063227,530.7777901195861)));
	this.Unistrokes[24] = new Unistroke("eight", new Array(new Point(328.27497585507973,521.6914308930576),new Point(328.74103245667857,535.7363274158274),new Point(330.76011301264475,550.1460374942811),new Point(333.20050880931416,564.089257630423),new Point(339.6849952808637,577.1747927795902),new Point(345.2377844186896,590.7175612189368),new Point(352.7940680082552,603.277108684189),new Point(360.94967982395843,615.5425340061063),new Point(369.1052916396617,627.8079593280238),new Point(379.3192047628691,636.7816558304706),new Point(389.6509693028232,645.0924800055406),new Point(400.72881681486507,642.33855636455),new Point(412.3271728733672,642.1080653920753),new Point(421.8103584921789,632.0774480029733),new Point(426.77403835993056,618.3027197310054),new Point(433.8714425631169,606.6707571117378),new Point(437.84810006541574,592.4331515928887),new Point(441.4676811637556,578.0888217446278),new Point(444.0718999769651,563.4410166238782),new Point(445.2340556384,548.8674762348058),new Point(444.20449440234256,534.4068069548138),new Point(444.0571744007217,519.9007031815615),new Point(441.53945516386113,505.2919811789074),new Point(440.9169446548624,490.43190610236934),new Point(440.67679891235116,475.59191235853524),new Point(437.18466416881677,461.92933305586877),new Point(438.22662842507384,447.30079150766966),new Point(437.16274270858827,432.57209135600056),new Point(441.642415328832,421.5197318045739),new Point(448.3218854626396,409.6072503061918),new Point(460.1604188433708,401.15755096734705),new Point(473.1857412587245,395.86473252890266),new Point(487.32853853334325,398.32914826452003),new Point(500.97331432686065,395.0924800055406),new Point(515.1517369374594,395.82289912413427),new Point(526.8179396083495,403.7969500692389),new Point(536.88829607722,413.8710556718155),new Point(547.4556781647583,423.3763428487067),new Point(555.6112899804616,435.6417681706241),new Point(563.7669017961648,447.9071934925415),new Point(571.1130992975031,460.49924848066445),new Point(573.0275313774027,474.60899984948816),new Point(578.2749758550797,487.5183348533219),new Point(576.0418959298245,500.0786156554895),new Point(577.8219165175826,513.7556877096755),new Point(572.429469445932,523.4355721240529),new Point(563.7680979235818,534.0177941466861),new Point(551.9295645428505,542.4674934855309),new Point(539.0982573599646,548.2763960500463),new Point(525.4536401460937,551.5053457412405),new Point(511.4320171286718,549.3713961755924),new Point(497.7370791166776,548.8212200573092),new Point(484.1585137396888,548.8352200911584),new Point(470.8632079367344,543.6925522638321),new Point(456.69899008992945,542.2707428274606),new Point(442.53389794452994,540.8914882404298),new Point(428.40333928185095,538.2294171523264),new Point(416.4093205002274,539.2681822166896),new Point(405.29939884019717,535.334215235947),new Point(394.0052438627285,533.3965009860208),new Point(380.40950762128097,534.2462607415348),new Point(366.230451488047,534.2027503916288),new Point(356.1099358044758,532.214240681242),new Point(341.9719401520498,529.5161149634619)));
	this.Unistrokes[25] = new Unistroke("nine", new Array(new Point(455.23078444202815,712.2974207388972),new Point(461.35323741566134,724.3075328703421),new Point(465.16041750085856,737.6753395421733),new Point(469.6283499696915,750.9294975589552),new Point(474.61830350362607,763.5800294772325),new Point(479.81775526011376,776.1120917501162),new Point(485.94020823374706,788.122203881561),new Point(492.0626612073803,800.1323160130058),new Point(499.4646688706407,809.7059877442196),new Point(508.76477284042,815.5314326127101),new Point(518.6556279018956,820.2144082138961),new Point(528.7130399789826,824.5560490974339),new Point(538.6397085990301,829.0287128057589),new Point(549.0764505796311,829.3647869570368),new Point(558.7908070810787,827.4912602848001),new Point(568.665906509725,825.8252976838056),new Point(578.1524467819447,819.4061269289905),new Point(587.7389111156797,813.612595113627),new Point(596.3610058078497,805.0843488627931),new Point(604.9831005000194,796.5561026119593),new Point(613.4345047319597,787.8186874023778),new Point(618.8960510763493,775.4174150545529),new Point(619.324354280174,763.567088447878),new Point(615.2571737614606,750.9024382049267),new Point(609.1347207878274,738.892326073482),new Point(602.7386548729645,727.3154426200826),new Point(593.9078454898976,719.2752312649972),new Point(584.5094996559188,712.8878720776818),new Point(575.9516223882868,704.3801476187544),new Point(566.0814214196492,699.649136894019),new Point(556.2149153623435,694.8047784154919),new Point(546.0910806896961,690.6145848991897),new Point(535.6583663489283,689.4836353097446),new Point(525.5229779830316,686.3416651657469),new Point(515.8162514226518,689.2572776254985),new Point(506.2428123742265,691.9893586531365),new Point(497.53034133836684,699.9669775555766),new Point(488.3373041783254,705.0166969670347),new Point(479.5606288343318,708.0786334641366),new Point(476.985347101693,705.5339977972873),new Point(486.12830214383536,700.1791478322483),new Point(495.5848656135821,694.5141029560615),new Point(505.0732694093391,688.6365325248023),new Point(515.2832978093314,684.8253407240729),new Point(525.4206006575441,680.6428289434054),new Point(535.6945312196494,677.1579069195725),new Point(545.2325320446517,671.2269445472812),new Point(554.8189963783867,665.4334127319179),new Point(564.2755598481334,659.768367855731),new Point(572.8976545403034,651.2401216048971),new Point(582.9187529354961,647.1759585310851),new Point(592.7751511213618,642.6447462879939),new Point(602.3616154550967,636.8512144726305),new Point(611.9933036077953,631.4120561262679),new Point(622.1891942335704,627.5286800944087),new Point(632.0808652091592,622.3368812281266),new Point(641.63410382755,616.4491294793846),new Point(651.297919219665,614.2676758001405),new Point(660.7544826894118,608.6026309239537),new Point(669.8974377315542,603.2477809589147),new Point(679.0403927736967,597.8929309938757),new Point(688.200057381615,591.209176667844),new Point(697.1190509356132,583.6996398668549),new Point(705.2307844420282,579.3647869570368),));
	

	

	//
	// The $1 Gesture Recognizer API begins here -- 3 methods: Recognize(), AddGesture(), and DeleteUserGestures()
	//
	this.Recognize = function(points, useProtractor)
	{
		var t0 = Date.now();
		var candidate = new Unistroke("", points);

		var u = -1;
		var b = +Infinity;
		for (var i = 0; i < this.Unistrokes.length; i++) // for each unistroke template
		{
			var d;
			if (useProtractor)
				d = OptimalCosineDistance(this.Unistrokes[i].Vector, candidate.Vector); // Protractor
			else
				d = DistanceAtBestAngle(candidate.Points, this.Unistrokes[i], -AngleRange, +AngleRange, AnglePrecision); // Golden Section Search (original $1)
			if (d < b) {
				b = d; // best (least) distance
				u = i; // unistroke index
			}
		}
		var t1 = Date.now();
		return (u == -1) ? new Result("No match.", 0.0, t1-t0) : new Result(this.Unistrokes[u].Name, useProtractor ? (1.0 - b) : (1.0 - b / HalfDiagonal), t1-t0);
	}
	this.AddGesture = function(name, points)
	{
		this.Unistrokes[this.Unistrokes.length] = new Unistroke(name, points); // append new unistroke
		var num = 0;
		for (var i = 0; i < this.Unistrokes.length; i++) {
			if (this.Unistrokes[i].Name == name)
				num++;
		}
		return num;
	}
	this.DeleteUserGestures = function()
	{
		this.Unistrokes.length = NumUnistrokes; // clear any beyond the original set
		return NumUnistrokes;
	}
}
//
// Private helper functions from here on down
//
function Resample(points, n)
{
	var I = PathLength(points) / (n - 1); // interval length
	var D = 0.0;
	var newpoints = new Array(points[0]);
	for (var i = 1; i < points.length; i++)
	{
		var d = Distance(points[i-1], points[i]);
		if ((D + d) >= I)
		{
			var qx = points[i-1].X + ((I - D) / d) * (points[i].X - points[i-1].X);
			var qy = points[i-1].Y + ((I - D) / d) * (points[i].Y - points[i-1].Y);
			var q = new Point(qx, qy);
			newpoints[newpoints.length] = q; // append new point 'q'
			points.splice(i, 0, q); // insert 'q' at position i in points s.t. 'q' will be the next i
			D = 0.0;
		}
		else D += d;
	}
	if (newpoints.length == n - 1) // somtimes we fall a rounding-error short of adding the last point, so add it if so
		newpoints[newpoints.length] = new Point(points[points.length - 1].X, points[points.length - 1].Y);
	return newpoints;
}
function IndicativeAngle(points)
{
	var c = Centroid(points);
	return Math.atan2(c.Y - points[0].Y, c.X - points[0].X);
}
function RotateBy(points, radians) // rotates points around centroid
{
	var c = Centroid(points);
	var cos = Math.cos(radians);
	var sin = Math.sin(radians);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = (points[i].X - c.X) * cos - (points[i].Y - c.Y) * sin + c.X
		var qy = (points[i].X - c.X) * sin + (points[i].Y - c.Y) * cos + c.Y;
		newpoints[newpoints.length] = new Point(qx, qy);
	}
	return newpoints;
}
function ScaleTo(points, size) // non-uniform scale; assumes 2D gestures (i.e., no lines)
{
	var B = BoundingBox(points);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = points[i].X * (size / B.Width);
		var qy = points[i].Y * (size / B.Height);
		newpoints[newpoints.length] = new Point(qx, qy);
	}
	return newpoints;
}
function TranslateTo(points, pt) // translates points' centroid
{
	var c = Centroid(points);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
		var qx = points[i].X + pt.X - c.X;
		var qy = points[i].Y + pt.Y - c.Y;
		newpoints[newpoints.length] = new Point(qx, qy);
	}
	return newpoints;
}
function Vectorize(points) // for Protractor
{
	var sum = 0.0;
	var vector = new Array();
	for (var i = 0; i < points.length; i++) {
		vector[vector.length] = points[i].X;
		vector[vector.length] = points[i].Y;
		sum += points[i].X * points[i].X + points[i].Y * points[i].Y;
	}
	var magnitude = Math.sqrt(sum);
	for (var i = 0; i < vector.length; i++)
		vector[i] /= magnitude;
	return vector;
}
function OptimalCosineDistance(v1, v2) // for Protractor
{
	var a = 0.0;
	var b = 0.0;
	for (var i = 0; i < v1.length; i += 2) {
		a += v1[i] * v2[i] + v1[i+1] * v2[i+1];
		b += v1[i] * v2[i+1] - v1[i+1] * v2[i];
	}
	var angle = Math.atan(b / a);
	return Math.acos(a * Math.cos(angle) + b * Math.sin(angle));
}
function DistanceAtBestAngle(points, T, a, b, threshold)
{
	var x1 = Phi * a + (1.0 - Phi) * b;
	var f1 = DistanceAtAngle(points, T, x1);
	var x2 = (1.0 - Phi) * a + Phi * b;
	var f2 = DistanceAtAngle(points, T, x2);
	while (Math.abs(b - a) > threshold)
	{
		if (f1 < f2) {
			b = x2;
			x2 = x1;
			f2 = f1;
			x1 = Phi * a + (1.0 - Phi) * b;
			f1 = DistanceAtAngle(points, T, x1);
		} else {
			a = x1;
			x1 = x2;
			f1 = f2;
			x2 = (1.0 - Phi) * a + Phi * b;
			f2 = DistanceAtAngle(points, T, x2);
		}
	}
	return Math.min(f1, f2);
}
function DistanceAtAngle(points, T, radians)
{
	var newpoints = RotateBy(points, radians);
	return PathDistance(newpoints, T.Points);
}
function Centroid(points)
{
	var x = 0.0, y = 0.0;
	for (var i = 0; i < points.length; i++) {
		x += points[i].X;
		y += points[i].Y;
	}
	x /= points.length;
	y /= points.length;
	return new Point(x, y);
}
function BoundingBox(points)
{
	var minX = +Infinity, maxX = -Infinity, minY = +Infinity, maxY = -Infinity;
	for (var i = 0; i < points.length; i++) {
		minX = Math.min(minX, points[i].X);
		minY = Math.min(minY, points[i].Y);
		maxX = Math.max(maxX, points[i].X);
		maxY = Math.max(maxY, points[i].Y);
	}
	return new Rectangle(minX, minY, maxX - minX, maxY - minY);
}
function PathDistance(pts1, pts2)
{
	var d = 0.0;
	for (var i = 0; i < pts1.length; i++) // assumes pts1.length == pts2.length
		d += Distance(pts1[i], pts2[i]);
	return d / pts1.length;
}
function PathLength(points)
{
	var d = 0.0;
	for (var i = 1; i < points.length; i++)
		d += Distance(points[i - 1], points[i]);
	return d;
}
function Distance(p1, p2)
{
	var dx = p2.X - p1.X;
	var dy = p2.Y - p1.Y;
	return Math.sqrt(dx * dx + dy * dy);
}
function Deg2Rad(d) { return (d * Math.PI / 180.0); }