# 两数之和

> 这是LeetCode上的经典题目，也是算法入门必刷题之一。通过这道题，我们可以学习到哈希表的使用技巧。

## 题目描述

给定一个整数数组 `nums` 和一个整数目标值 `target`，请你在该数组中找出和为目标值 `target` 的那两个整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。

你可以按任意顺序返回答案。

## 示例

```text
输入：nums = [2,7,11,15], target = 9
输出：[0,1]
解释：因为 nums[0] + nums[1] == 9 ，返回 [0, 1] 。

输入：nums = [3,2,4], target = 6
输出：[1,2]

输入：nums = [3,3], target = 6
输出：[0,1]
```

## 解题思路

### 方法一：暴力解法

最直观的解法是使用双重循环遍历数组，找到两个数的和等于目标值。

```java
public int[] twoSum(int[] nums, int target) {
    for (int i = 0; i < nums.length; i++) {
        for (int j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] == target) {
                return new int[]{i, j};
            }
        }
    }
    return new int[0];
}
```

**时间复杂度**：O(n²)  
**空间复杂度**：O(1)

### 方法二：哈希表解法

使用哈希表存储已经遍历过的数字和它们的索引，这样可以在O(1)时间内查找目标值。

```java
public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[]{map.get(complement), i};
        }
        map.put(nums[i], i);
    }
    
    return new int[0];
}
```

**时间复杂度**：O(n)  
**空间复杂度**：O(n)

## 详细解析

### 哈希表解法的核心思想

1. **一次遍历**：我们只需要遍历数组一次
2. **边遍历边存储**：在遍历过程中，将当前数字和索引存储到哈希表中
3. **查找补数**：对于当前数字，计算其补数（target - 当前数字）
4. **快速查找**：在哈希表中查找补数，如果存在则返回结果

### 为什么哈希表解法更优？

- **时间效率**：从O(n²)降低到O(n)
- **空间换时间**：使用O(n)的额外空间换取时间效率
- **一次遍历**：避免了嵌套循环

## 代码实现

### Java版本

```java
import java.util.HashMap;
import java.util.Map;

public class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[]{map.get(complement), i};
            }
            map.put(nums[i], i);
        }
        
        return new int[0];
    }
}
```

### Python版本

```python
def twoSum(nums, target):
    hash_map = {}
    
    for i, num in enumerate(nums):
        complement = target - num
        if complement in hash_map:
            return [hash_map[complement], i]
        hash_map[num] = i
    
    return []
```

### JavaScript版本

```javascript
function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    
    return [];
}
```

## 边界情况考虑

1. **空数组**：返回空数组
2. **无解情况**：返回空数组
3. **重复元素**：题目保证有唯一解
4. **负数**：算法对负数同样适用

## 扩展思考

### 如果要求返回所有可能的解？

```java
public List<int[]> twoSumAll(int[] nums, int target) {
    List<int[]> result = new ArrayList<>();
    Map<Integer, List<Integer>> map = new HashMap<>();
    
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            for (int index : map.get(complement)) {
                result.add(new int[]{index, i});
            }
        }
        map.computeIfAbsent(nums[i], k -> new ArrayList<>()).add(i);
    }
    
    return result;
}
```

### 如果数组已排序？

如果数组已排序，可以使用双指针法：

```java
public int[] twoSumSorted(int[] nums, int target) {
    int left = 0, right = nums.length - 1;
    
    while (left < right) {
        int sum = nums[left] + nums[right];
        if (sum == target) {
            return new int[]{left, right};
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    
    return new int[0];
}
```

## 总结

两数之和问题虽然简单，但包含了算法设计中的重要思想：

1. **暴力解法**：直观但效率低
2. **哈希表优化**：空间换时间
3. **双指针法**：适用于已排序数组

通过这道题，我们学会了：
- 如何分析算法复杂度
- 如何使用哈希表优化查找
- 如何考虑边界情况
- 如何根据数据特点选择最优解法

---

*本文首发于个人博客，转载请注明出处。*
