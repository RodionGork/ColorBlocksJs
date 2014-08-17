<?php
class ColorBlocks {

	function gen($sz) {
		$this->sz = $sz;
		$b = array();
		for ($i = 0; $i < $sz; $i++) {
			$c = array();
			for ($j = 0; $j < $sz; $j++) {
				$c[] = rand(1, 4);
			}
			$b[] = $c;
		}
		$this->box = $b;
	}
	
	function load($sz, $box) {
		$this->sz = $sz;
		$box = explode('-', $box);
		$this->box = array();
		for ($x = 0; $x < $sz; $x++) {
			$col = array();
			for ($y = 0; $y < $sz; $y++) {
				$col[] = intval($box[$sz - $y - 1][$x]);
			}
			$this->box[] = $col;
		}
	}
	
	function move($x, $y) {
		if ($this->box[$x][$y] == 0) {
			return 0;
		}
		list($res, $minx, $maxx) = $this->fill($x, $y, 0);
		$this->sweep($minx, $maxx);
		$this->press();
		return $res;
	}
	
	function fill($x, $y, $color) {
		$b =& $this->box;
		$prevColor = $b[$x][$y];
		$st = array();
		$st[] = array($x, $y);
		$cnt = 0;
		$minx = $x;
		$maxx = $x;
		while (!empty($st)) {
			list($cx, $cy) = array_pop($st);
			if ($b[$cx][$cy] != $prevColor) {
				continue;
			}
			$cnt++;
			$minx = min($minx, $cx);
			$maxx = max($maxx, $cx);
			$b[$cx][$cy] = $color;
			if ($cx > 0 && $b[$cx - 1][$cy] == $prevColor) {
				$st[] = array($cx - 1, $cy);
			}
			if ($cy > 0 && $b[$cx][$cy - 1] == $prevColor) {
				$st[] = array($cx, $cy - 1);
			}
			if ($cx < $this->sz - 1 && $b[$cx + 1][$cy] == $prevColor) {
				$st[] = array($cx + 1, $cy);
			}
			if ($cy < $this->sz - 1 && $b[$cx][$cy + 1] == $prevColor) {
				$st[] = array($cx, $cy + 1);
			}
		}
		return array($cnt, $minx, $maxx);
	}
	
	function sweep($minx, $maxx) {
		$b =& $this->box;
		for ($x = $minx; $x <= $maxx; $x++) {
			$yy = 0;
			for ($y = 0; $y < $this->sz; $y++) {
				$c = $b[$x][$y];
				if ($c > 0) {
					$b[$x][$yy++] = $c;
				}
			}
			while ($yy < $this->sz) {
				$b[$x][$yy++] = 0;
			}
		}
	}
	
	function press() {
		$b =& $this->box;
		for ($x = $this->sz - 1; $x >= 0; $x--) {
			if ($b[$x][0] == 0) {
				array_splice($b, $x, 1);
				$b[] = array_fill(0, $this->sz, 0);
			}
		}
	}
	
	function prn($sep = "\n") {
		$sz = $this->sz;
		$s = array();
		for ($y = 0; $y < $sz; $y++) {
			$r = '';
			for ($x = 0; $x < $sz; $x++) {
				$r .= $this->box[$x][$sz - $y - 1];
			}
			$s[] = $r;
		}
		return implode($sep, $s);
	}

}

function checker($expected = null, $answer = null) {
	srand(314159);
	$cb = new ColorBlocks();
	$sz = 130;
	$cb->gen($sz);
	$counts = array_fill(0, 4, 0);
	for ($x = 0; $x < $cb->sz; $x++) {
		for ($y = 0; $y < $cb->sz; $y++) {
			$counts[$cb->box[$x][$y] - 1]++;
		}
	}
	$max = max($counts);
	$lower = $max * ($max + 1) / 2;
	
	$expected = '#php';
	$answer = '0 0';
	for ($i = 0; $i < 2500; $i++) {
		$answer .= ' 2 0 5 0';
	}
	for ($i = 0; $i < 568; $i++) {
		$answer .= ' 0 0';
	}
	echo "$answer\n";
	if ($expected === null) {
		$box = $cb->prn();
		return array("$sz\n$box", "#php $max $lower");
	}
	$sum = 0;
	$answer = explode(' ', $answer);
	if (count($answer) < 2) {
		return 'Answer seems to have too few data!';
	}
	if (count($answer) % 2 != 0) {
		return 'Answer should consist of even amount of values';
	}
	$score = 0;
	$time = time();
	for ($i = 0; $i < count($answer); $i += 2) {
		$x = $answer[$i];
		$y = $answer[$i + 1];
		if (!is_numeric($x) || !is_numeric($y)) {
			return 'Answer should contain integer coordinates';
		}
		$x = intval($x);
		$y = intval($y);
		if ($x < 0 || $x >= $sz || $y < 0 || $y >= $sz) {
			return "Move $x,$y falls out of the field!";
		}
		$res = $cb->move($x, $y);
		if ($res == 0) {
			return 'Move #' . ($i / 2 + 1) . " ($x,$y) is invalid!";
		}
		$score += $res * ($res + 1) / 2;
	}
	if ($cb->box[0][0] != 0) {
		return 'Field is not empty after all moves have been done!';
	}
	$pts = max($score / $lower - 1, 0);
	return "ok $pts Total of {$score} points";
}

echo checker();

