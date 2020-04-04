import React from "react";
import test from "ava";
import { renderToString } from "./helpers/render-to-string";
import chalk from "chalk";
import { Color, Box, Text } from "../src";
import { findByName } from "./helpers/regions";

test("findAll matches multiple regions", t => {
	const message = findByName(
		"message",
		"\x1b_message\x1b[Hello\x1b_/message\x1b[ \x1b_message\x1b[World\x1b_/message\x1b["
	);

	t.deepEqual(message, ["Hello", "World"]);
});

test("Text wraps in a region", t => {
	const output = renderToString(<Text name="greeting">Hello World</Text>);

	t.is(output, "\x1b_greeting\x1b[Hello World\x1b_/greeting\x1b[");
});

test("Retrieving multiple regions", t => {
	const output = renderToString(
		<>
			<Text name="greeting">Hello</Text> <Text name="greeting">World</Text>
		</>
	);

	t.deepEqual(findByName("greeting", output), ["Hello", "World"]);
});

test("Box with multiple Color children", t => {
	const output = renderToString(
		<Box name="message">
			<Color red>Hello</Color> <Color blue>World</Color>
		</Box>
	);

	t.deepEqual(
		findByName("message", output),
		[`${chalk.red("Hello")} ${chalk.blue("World")}`]
	);
});

test("Getting Boxes inside of a Box", t => {
	const output = renderToString(
		<Box name="shoebox">
			<Box>
				<Text name="postcard">Paris</Text>
			</Box>
			<Box name="pin">
				<Text>Vote</Text>
			</Box>
		</Box>
	);

	console.log(output);

	t.deepEqual(findByName("postcard", output), ["Paris"]);
});
